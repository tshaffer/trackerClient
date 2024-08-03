import { clone, cloneDeep } from 'lodash';
import { CheckingAccountTransaction, SplitTransaction, Transaction, TransactionsState } from '../types';
import { TrackerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
const CLEAR_TRANSACTIONS = 'CLEAR_TRANSACTIONS';
const ADD_TRANSACTIONS = 'ADD_TRANSACTIONS';
const UPDATE_TRANSACTION = 'UPDATE_TRANSACTION';
const SET_OVERRIDE_CATEGORY = 'SET_OVERRIDE_CATEGORY';
const SET_OVERRIDE_CATEGORY_ID = 'SET_OVERRIDE_CATEGORY_ID';
const SET_OVERRIDE_FIXED_EXPENSE = 'SET_OVERRIDE_FIXED_EXPENSE';
const SET_OVERRIDDEN_FIXED_EXPENSE = 'SET_OVERRIDDEN_FIXED_EXPENSE';
const SET_SPLIT_TRANSACTION = 'SET_SPLIT_TRANSACTION';

// ------------------------------------
// Actions
// ------------------------------------

export const clearTransactions = (
): any => {
  return {
    type: CLEAR_TRANSACTIONS,
    payload: null,
  };
};

interface AddTransactionsPayload {
  transactions: Transaction[];
}

export const addTransactions = (
  transactions: Transaction[],
): any => {
  return {
    type: ADD_TRANSACTIONS,
    payload: {
      transactions
    }
  };
};

interface UpdateTransactionPayload {
  transaction: Transaction;
}

export const updateTransactionRedux = (
  transaction: Transaction
): any => {
  return {
    type: UPDATE_TRANSACTION,
    payload: {
      transaction,
    },
  };
};

interface SetOverrideCategoryPayload {
  transactionId: string;
  overrideCategory: boolean;
}

export const setOverrideCategory = (
  transactionId: string,
  overrideCategory: boolean
): any => {
  return {
    type: SET_OVERRIDE_CATEGORY,
    payload: {
      transactionId,
      overrideCategory,
    },
  };
};

interface SetOverrideCategoryIdPayload {
  transactionId: string;
  overrideCategoryId: string;
}

export const setOverrideCategoryId = (
  transactionId: string,
  overrideCategoryId: string
): any => {
  return {
    type: SET_OVERRIDE_CATEGORY_ID,
    payload: {
      transactionId,
      overrideCategoryId,
    },
  };
};

interface setOverrideFixedExpensePayload {
  transactionId: string;
  overrideFixedExpense: boolean;
}

export const setOverrideFixedExpense = (
  transactionId: string,
  overrideFixedExpense: boolean
): any => {
  return {
    type: SET_OVERRIDE_FIXED_EXPENSE,
    payload: {
      transactionId,
      overrideFixedExpense,
    },
  };
};

interface setOverriddenFixedExpensePayload {
  transactionId: string;
  overriddenFixedExpense: boolean;
}

export const setOverriddenFixedExpense = (
  transactionId: string,
  overriddenFixedExpense: boolean
): any => {
  return {
    type: SET_OVERRIDDEN_FIXED_EXPENSE,
    payload: {
      transactionId,
      overriddenFixedExpense,
    },
  };
};

interface SetSplitTransactionPayload {
  parentTransactionId: string;
  splitTransactions: SplitTransaction[];
}

export const splitTransactionRedux = (
  parentTransactionId: string,
  splitTransactions: SplitTransaction[]
): any => {
  return {
    type: SET_SPLIT_TRANSACTION,
    payload: {
      parentTransactionId,
      splitTransactions,
    },
  };
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState: TransactionsState = {
  byId: {},
  allIds: [],
};

export const transactionsStateReducer = (
  state: TransactionsState = initialState,
  action: TrackerModelBaseAction<AddTransactionsPayload & UpdateTransactionPayload & SetOverrideCategoryPayload & SetOverrideCategoryIdPayload & setOverrideFixedExpensePayload & setOverriddenFixedExpensePayload & SetSplitTransactionPayload>
): TransactionsState => {
  switch (action.type) {
    case CLEAR_TRANSACTIONS: {
      return initialState;
    }
    case ADD_TRANSACTIONS: {
      const newState = cloneDeep(state);
      const transactions = action.payload.transactions;
      transactions.forEach(transaction => {
        newState.byId[transaction.id] = transaction;
        if (!newState.allIds.includes(transaction.id)) {
          newState.allIds.push(transaction.id);
        }
      });
      return newState;
    }
    case UPDATE_TRANSACTION: {
      const newState = clone(state);
      const id = action.payload.transaction.id;
      if (newState.byId[id]) {
        newState.byId[id] = action.payload.transaction;
      }
      return newState;
    }
    case SET_OVERRIDE_CATEGORY: {
      const newState = clone(state);
      const id = action.payload.transactionId;
      if (newState.byId[id]) {
        newState.byId[id].overrideCategory = action.payload.overrideCategory;
      }
      return newState;
    }
    case SET_OVERRIDE_CATEGORY_ID: {
      const newState = clone(state);
      const id = action.payload.transactionId;
      if (newState.byId[id]) {
        newState.byId[id].overrideCategoryId = action.payload.overrideCategoryId;
      }
      return newState;
    }
    case SET_OVERRIDE_FIXED_EXPENSE: {
      const newState = clone(state);
      const id = action.payload.transactionId;
      if (newState.byId[id]) {
        newState.byId[id].overrideFixedExpense = action.payload.overrideCategory;
      }
      return newState;
    }
    case SET_OVERRIDDEN_FIXED_EXPENSE: {
      const newState = clone(state);
      const id = action.payload.transactionId;
      if (newState.byId[id]) {
        newState.byId[id].overriddenFixedExpense = action.payload.overriddenFixedExpense;
      }
      return newState;
    }
    case SET_SPLIT_TRANSACTION: {
      const newState = clone(state);
      const parentTransactionId = action.payload.parentTransactionId;
      const parentTransaction: CheckingAccountTransaction = newState.byId[parentTransactionId] as CheckingAccountTransaction;
      parentTransaction.isSplit = true;
      action.payload.splitTransactions.forEach(splitTransaction => {
        const newTransaction: CheckingAccountTransaction = {
          ...parentTransaction,
          ...splitTransaction,
          parentTransactionId
        };
        newState.byId[splitTransaction.id] = newTransaction;
      });
      return newState;
    }
    default:
      return state;
  }
};
