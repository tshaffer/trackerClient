import { isNil } from 'lodash';
import { TrackerState, Transaction } from '../types';

export const getTransactionIds = (state: TrackerState): string[] => {
  return state.transactionsState.allIds;
};

export const getTransactions = (state: TrackerState): Transaction[] => {
  return getTransactionIds(state).map((id) => state.transactionsState.byId[id]);
}

export const getTransactionById = (state: TrackerState, id: string): Transaction | undefined => {
  return state.transactionsState.byId[id];
};

export const getTransactionsByCategory = (state: TrackerState, categoryId: string): Transaction[] => {
  return getTransactions(state).filter((transaction) => {
    !isNil(transaction.categoryId) &&
    (transaction.categoryId === categoryId)
  }
  );
};

