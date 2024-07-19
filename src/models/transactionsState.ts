import { clone, cloneDeep } from 'lodash';
import { Transaction, TransactionsState } from '../types';
import { TrackerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_TRANSACTIONS = 'ADD_TRANSACTIONS';
export const UPDATE_TRANSACTION_DESCRIPTION = 'UPDATE_TRANSACTION_DESCRIPTION';

// ------------------------------------
// Actions
// ------------------------------------
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
  id: string;
  description: string;
}

export const updateTransactionDescription = (
  id: string,
  description: string,
): any => {
  return {
    type: UPDATE_TRANSACTION_DESCRIPTION,
    payload: {
      id,
      description,
    }
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
    case UPDATE_TRANSACTION_DESCRIPTION: {
      const newState = clone(state);
      const { id, description } = action.payload;
      if (newState.byId[id]) {
        newState.byId[id].userDescription = description;
      }
      return newState;
    }
    default:
      return state;
  }
};
