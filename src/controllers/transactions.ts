import axios from "axios";
import {
  apiUrlFragment,
  CheckTransaction,
  MinMaxDates,
  serverUrl,
  Transaction,
  Transactions,
} from "../types";
import {
  addTransactions,
  clearTransactions,
  setMinMaxTransactionDates,
  TrackerAnyPromiseThunkAction,
  TrackerDispatch,
  TrackerVoidPromiseThunkAction,
  updateCheckTransactionRedux,
  updateTransactionRedux
} from "../models";
import { isNil } from "lodash";

const getISODateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const getMinDate = (date1: string, date2: string): string => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const minDate = d1 < d2 ? d1 : d2;
  return getISODateString(minDate);
};

const getMaxDate = (date1: string, date2: string): string => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const maxDate = d1 > d2 ? d1 : d2;
  return getISODateString(maxDate);
};

export const loadAccountMinMaxTransactionDates = (endpoint: string): Promise<MinMaxDates> => {

  const path = serverUrl + apiUrlFragment + endpoint;

  return axios.get(path)
    .then((response: any) => {
      const minMaxStartDates: MinMaxDates = response.data;
      return Promise.resolve(minMaxStartDates);
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return Promise.resolve({ minDate: '', maxDate: '' });
    });
};


export const loadMinMaxTransactionDates = (): TrackerAnyPromiseThunkAction => {

  return (dispatch: TrackerDispatch, getState: any) => {

    const p1 = loadAccountMinMaxTransactionDates('minMaxCreditCardTransactionDates');
    const p2 = loadAccountMinMaxTransactionDates('minMaxCheckingAccountTransactionDates');

    return Promise.all([p1, p2])
      .then((results) => {

        let minDate: string = '';
        let maxDate: string = '';

        const [result1, result2] = results;

        if (isNil(result1)) {
          if (result2 !== null) {
            ({ minDate, maxDate } = result2);
          }
        } else if (isNil(result2)) {
          ({ minDate, maxDate } = result1);
        } else {
          minDate = getMinDate(result1.minDate, result2.minDate);
          maxDate = getMaxDate(result1.maxDate, result2.maxDate);
        }

        const minMaxStartDates: MinMaxDates = {
          minDate,
          maxDate,
        };
        return dispatch(setMinMaxTransactionDates(minMaxStartDates));
      });
  };
};

export const loadTransactions = (startDate: string, endDate: string, includeCreditCardTransactions: boolean, includeCheckingAccountTransactions: boolean): TrackerVoidPromiseThunkAction => {
  return async (dispatch: TrackerDispatch, getState: any) => {
    const transactionsFromDb: Transactions = await getTransactions(startDate, endDate, includeCreditCardTransactions, includeCheckingAccountTransactions);
    dispatch(clearTransactions());
    const { creditCardTransactions, checkingAccountTransactions } = transactionsFromDb;
    dispatch(addTransactions(creditCardTransactions as Transaction[]));
    dispatch(addTransactions(checkingAccountTransactions as Transaction[]));
    return Promise.resolve();
  };
}

const getTransactions = async (startDate: string, endDate: string, includeCreditCardTransactions: boolean, includeCheckingAccountTransactions: boolean): Promise<Transactions> => {

  let path = serverUrl
    + apiUrlFragment
    + 'transactions';

  path += '?startDate=' + startDate;
  path += '&endDate=' + endDate;
  path += '&includeCreditCardTransactions=' + includeCreditCardTransactions;
  path += '&includeCheckingAccountTransactions=' + includeCheckingAccountTransactions;

  return axios.get(path)
    .then((transactionsResponse: any) => {
      const transactions: Transactions = transactionsResponse.data;
      return Promise.resolve(transactions);
    });

}

export const updateCheckTransaction = (checkTransaction: CheckTransaction): TrackerAnyPromiseThunkAction => {

  return (dispatch: TrackerDispatch, getState: any) => {

    const path = serverUrl + apiUrlFragment + 'updateTransaction';

    const updateCheckTransactionBody = { checkTransaction };

    return axios.post(
      path,
      updateCheckTransactionBody
    ).then((response) => {
      console.log('updateCheckTransaction');
      console.log(response);
      console.log(response.data);
      dispatch(updateCheckTransactionRedux(checkTransaction));
      return Promise.resolve(response.data as CheckTransaction);
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return '';
    });
  };
}

export const updateTransaction = (transaction: Transaction): TrackerAnyPromiseThunkAction => {

  return (dispatch: TrackerDispatch, getState: any) => {

    const path = serverUrl + apiUrlFragment + 'updateTransaction';

    const updateTransactionBody = { transaction };

    console.log('updateTransaction: ', updateTransactionBody);
    return axios.post(
      path,
      updateTransactionBody
    ).then((response) => {
      console.log('updateTransaction');
      console.log(response);
      console.log(response.data);
      dispatch(updateTransactionRedux(transaction));
      return Promise.resolve(response.data as CheckTransaction);
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return '';
    });
  };
}
