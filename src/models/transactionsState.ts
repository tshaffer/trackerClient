import { clone, cloneDeep } from 'lodash';
import { Transaction, TransactionsState } from '../types';
import { TrackerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
const CLEAR_TRANSACTIONS = 'CLEAR_TRANSACTIONS';
const ADD_TRANSACTIONS = 'ADD_TRANSACTIONS';
const UPDATE_TRANSACTION = 'UPDATE_TRANSACTION';

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

// ------------------------------------
// Reducer
// ------------------------------------
const initialState: TransactionsState = {
  byId: {},
  allIds: [],
};

export const transactionsStateReducer = (
  state: TransactionsState = initialState,
  action: TrackerModelBaseAction<AddTransactionsPayload & UpdateTransactionPayload>
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
        newState.byId[id].userDescription = action.payload.transaction.userDescription;
      }
      return newState;
    }
    default:
      return state;
  }
};
