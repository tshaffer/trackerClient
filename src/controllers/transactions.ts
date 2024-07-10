import axios from "axios";
import {
  apiUrlFragment,
  BankTransaction,
  CategorizedStatementData,
  CategorizedTransaction,
  CheckTransaction,
  MinMaxDates,
  serverUrl,
  StringToTransactionsLUT,
  Transaction,
} from "../types";
import {
  setMinMaxTransactionDates,
  setStatementData,
  setTransactionsByCategory,
  setUnidentifiedBankTransactions,
  TrackerAnyPromiseThunkAction,
  TrackerDispatch,
  TrackerVoidPromiseThunkAction,
  updateCheckTransactionRedux,
  updateTransactionRedux
} from "../models";
import { isNil } from "lodash";

interface Result {
  minDate: string;
  maxDate: string;
}

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

export const search = (startDate: string, endDate: string, includeCreditCardTransactions: boolean, includeCheckingAccountTransactions: boolean): TrackerVoidPromiseThunkAction => {

  return (dispatch: TrackerDispatch, getState: any) => {

    let path = serverUrl
      + apiUrlFragment
      + 'categorizedTransactions';

    path += '?startDate=' + startDate;
    path += '&endDate=' + endDate;
    path += '&includeCreditCardTransactions=' + includeCreditCardTransactions;
    path += '&includeCheckingAccountTransactions=' + includeCheckingAccountTransactions;

    return axios.get(path)
      .then((transactionsResponse: any) => {
        const categorizedStatementData: CategorizedStatementData = (transactionsResponse as any).data;
        const transactions: CategorizedTransaction[] = categorizedStatementData.transactions;
        const unidentifiedBankTransactions: BankTransaction[] = categorizedStatementData.unidentifiedBankTransactions;
        const transactionsByCategory: StringToTransactionsLUT = {};
        transactions.forEach((transaction: CategorizedTransaction) => {
          const category: string = transaction.category.name;
          if (!transactionsByCategory[category]) {
            transactionsByCategory[category] = [];
          }
          transactionsByCategory[category].push(transaction);
        });

        const { startDate, endDate, netDebits: netDebits } = categorizedStatementData;
        dispatch(setStatementData(startDate, endDate, netDebits));

        console.log(transactionsByCategory);
        dispatch(setTransactionsByCategory(transactionsByCategory));

        dispatch(setUnidentifiedBankTransactions(unidentifiedBankTransactions));
      });
  }
}

export const updateCheckTransaction = (checkTransaction: CheckTransaction): TrackerAnyPromiseThunkAction => {

  return (dispatch: TrackerDispatch, getState: any) => {

    const path = serverUrl + apiUrlFragment + 'updateCheckTransaction';

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

    dispatch(updateTransactionRedux(transaction));
    // const path = serverUrl + apiUrlFragment + 'updateTransaction';

    // const updateTransactionBody = { transaction };

    // console.log('updateTransaction: ', updateTransactionBody);
    return Promise.resolve();
    // return axios.post(
    //   path,
    //   updateTransactionBody
    // ).then((response) => {
    //   console.log('updateTransaction');
    //   console.log(response);
    //   console.log(response.data);
    //   return Promise.resolve(response.data as CheckTransaction);
    // }).catch((error) => {
    //   console.log('error');
    //   console.log(error);
    //   return '';
    // });
  };
}
