import { ReportDataState, StringToTransactionsLUT } from '../types';
import { TrackerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_STATEMENT_DATA = 'SET_STATEMENT_DATA';
export const SET_TRANSACTIONS_BY_CATEGORY = 'SET_TRANSACTIONS_BY_CATEGORY';

// ------------------------------------
// Actions
// ------------------------------------

interface SetStatementDataPayload {
  startDate: string,  
  endDate: string,
  total: number,
}

export const setStatementData = (
  startDate: string,
   endDate: string, 
   total: number,
): any => {

  return {
    type: SET_STATEMENT_DATA,
    payload: {
      startDate,
      endDate,
      total,
    },
  };
}

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
  startDate: '',
  endDate: '',
  transactionsByCategory: {},
  total: 0,
};

export const reportDataStateReducer = (
  state: ReportDataState = initialState,
  action: TrackerModelBaseAction<SetStatementDataPayload & SetTransactionsByCategoryPayload>
): ReportDataState => {
  switch (action.type) {
    case SET_STATEMENT_DATA: {
      return { ...state, startDate: action.payload.startDate, endDate: action.payload.endDate, total: action.payload.total };
    }
    case SET_TRANSACTIONS_BY_CATEGORY: {
      return { ...state, transactionsByCategory: action.payload.transactionsByCategory };
    }
    default:
      return state;
  }
};
