import { ReportDataState, StringToTransactionsLUT } from '../types';
import { TrackerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_TRANSACTIONS_BY_CATEGORY = 'SET_TRANSACTIONS_BY_CATEGORY';

// ------------------------------------
// Actions
// ------------------------------------

interface SetTransactionsByCategoryPayload {
  transactionsByCategory: StringToTransactionsLUT
}


export const setTransactionsByCategory = (
  transactionsByCategory: StringToTransactionsLUT,
): any => {
  return {
    type: SET_TRANSACTIONS_BY_CATEGORY,
    payload: {
      transactionsByCategory,
    },
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: ReportDataState = {
  transactionsByCategory: {},
};

export const reportDataStateReducer = (
  state: ReportDataState = initialState,
  action: TrackerModelBaseAction<SetTransactionsByCategoryPayload>
): ReportDataState => {
  switch (action.type) {
    case SET_TRANSACTIONS_BY_CATEGORY: {
      return { ...state, transactionsByCategory: action.payload.transactionsByCategory };
    }
    default:
      return state;
  }
};
