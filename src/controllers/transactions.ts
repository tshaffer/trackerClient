import axios from "axios";
import {
  apiUrlFragment,
  BankTransaction,
  BankTransactionType,
  CategorizedStatementData,
  CategorizedTransaction,
  Category,
  CategoryAssignmentRule,
  CheckingAccountTransaction,
  CheckTransaction,
  CreditCardTransaction,
  DisregardLevel,
  MinMaxDates,
  ReviewedTransactions,
  serverUrl,
  StringToTransactionsLUT,
  Transaction,
  Transactions,
} from "../types";
import {
  addTransactions,
  clearTransactions,
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
import { getCategories, getCategoryAssignmentRules, getCategoryByName } from "../selectors";
import { roundTo } from "../utilities";

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

export const getCategorizedTransactions = (startDate: string, endDate: string, includeCreditCardTransactions: boolean, includeCheckingAccountTransactions: boolean): TrackerVoidPromiseThunkAction => {

  return (dispatch: TrackerDispatch, getState: any) => {
    const state = getState();
    return doGetCategorizedTransactions(state, startDate, endDate, includeCreditCardTransactions, includeCheckingAccountTransactions)
      .then((categorizedStatementData: CategorizedStatementData) => {
        const transactions: CategorizedTransaction[] = categorizedStatementData.transactions;
        const unidentifiedBankTransactions: BankTransaction[] = categorizedStatementData.unidentifiedBankTransactions;
        const transactionsByCategoryId: StringToTransactionsLUT = {};
        transactions.forEach((transaction: CategorizedTransaction) => {
          const categoryId: string = transaction.categoryId;
          if (!transactionsByCategoryId[categoryId]) {
            transactionsByCategoryId[categoryId] = [];
          }
          transactionsByCategoryId[categoryId].push(transaction);

          const { startDate, endDate, netDebits: netDebits } = categorizedStatementData;
          dispatch(setStatementData(startDate, endDate, netDebits));
  
          console.log(transactionsByCategoryId);
          dispatch(setTransactionsByCategory(transactionsByCategoryId));
  
          dispatch(setUnidentifiedBankTransactions(unidentifiedBankTransactions));
          });

      });
  };
}

export const doGetCategorizedTransactions = async (state: any, startDate: string, endDate: string, includeCreditCardTransactions: boolean, includeCheckingAccountTransactions: boolean): Promise<CategorizedStatementData> => {

  const allCategories: Category[] = await getCategories(state);
  const categories: Category[] = [];
  for (const category of allCategories) {
    if (category.disregardLevel === DisregardLevel.None) {
      categories.push(category);
    }
  }

  const ignoreCategory: Category = getCategoryByName(state, 'Ignore') as Category;
  const categoryAssignmentRules = getCategoryAssignmentRules(state);

  const transactionsFromDb: Transactions = await getTransactions(startDate, endDate, includeCreditCardTransactions, includeCheckingAccountTransactions);
  const { creditCardTransactions, checkingAccountTransactions } = transactionsFromDb;
  // TEDTODO - separate out the credit card and checking account transactions??
  const allTransactions: BankTransaction[] = (checkingAccountTransactions as BankTransaction[]).concat(creditCardTransactions as BankTransaction[]);

  const reviewedTransactionEntities: ReviewedTransactions = categorizeTransactions(allTransactions, categories, ignoreCategory, categoryAssignmentRules);
  const categorizedTransactions: CategorizedTransaction[] = reviewedTransactionEntities.categorizedTransactions;
  const unidentifiedBankTransactions: BankTransaction[] = reviewedTransactionEntities.uncategorizedTransactions;

  const transactions: CategorizedTransaction[] = [];
  let sum = 0;

  for (const categorizedTransaction of categorizedTransactions) {
    const transaction: CategorizedTransaction = {
      bankTransaction: categorizedTransaction.bankTransaction,
      categoryId: categorizedTransaction.categoryId,
    };
    transactions.push(transaction);
    sum += transaction.bankTransaction.amount;
  }

  sum = roundTo(-sum, 2)

  const categorizedStatementData: CategorizedStatementData = {
    startDate,
    endDate,
    transactions,
    netDebits: sum,
    unidentifiedBankTransactions,
  };

  return categorizedStatementData;
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

const categorizeTransactions = (
  transactions: BankTransaction[],
  categories: Category[],
  ignoreCategory: Category,
  categoryAssignmentRules: CategoryAssignmentRule[]
): ReviewedTransactions => {

  const categorizedTransactions: CategorizedTransaction[] = [];
  const uncategorizedTransactions: BankTransaction[] = [];
  const ignoredTransactions: BankTransaction[] = [];

  let sum: number = 0;

  for (const transaction of transactions) {
    const category: Category | null = categorizeTransaction(transaction, categories, categoryAssignmentRules);
    if (!isNil(category)) {
      if (category.id === ignoreCategory.id) {
        ignoredTransactions.push(transaction);
      } else {
        const categorizedTransaction: CategorizedTransaction = {
          bankTransaction: transaction,
          categoryId: category.id,
        };
        categorizedTransactions.push(categorizedTransaction);

        sum += transaction.amount;
      }
    } else {
      uncategorizedTransactions.push(transaction);
    }
  }

  return {
    categorizedTransactions,
    uncategorizedTransactions,
    ignoredTransactions,
  };
};

const categorizeTransaction = (
  transaction: BankTransaction,
  categories: Category[],
  categoryAssignmentRules: CategoryAssignmentRule[]): Category | null => {

  const transactionDetails: string = transaction.bankTransactionType === BankTransactionType.CreditCard ?
    (transaction as CreditCardTransaction).description : (transaction as CheckingAccountTransaction).name;

  for (const categoryAssignmentRule of categoryAssignmentRules) {
    if (transactionDetails.includes(categoryAssignmentRule.pattern)) {
      const categoryId = categoryAssignmentRule.categoryId;
      for (const category of categories) {
        if (category.id === categoryId) {
          return category;
        }
      }
    }
  }

  if (transaction.bankTransactionType === BankTransactionType.CreditCard) {
    if (!isNil((transaction as unknown as CreditCardTransaction).category)) {
      for (const category of categories) {
        if ((transaction as unknown as CreditCardTransaction).category === category.name) {
          return category;
        }
      }
    }
  }

  return null;
};

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
