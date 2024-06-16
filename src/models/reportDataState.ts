import { BankTransactionEntity, ReportDataState, StringToTransactionsLUT } from '../types';
import { TrackerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_STATEMENT_DATA = 'SET_STATEMENT_DATA';
export const SET_TRANSACTIONS_BY_CATEGORY = 'SET_TRANSACTIONS_BY_CATEGORY';
export const SET_UNIDENTIFIED_BANK_TRANSACTIONS  = 'SET_UNIDENTIFIED_BANK_TRANSACTIONS';

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

interface SetUnidentifiedBankTransactionsPayload {
  unidentifiedBankTransactions: BankTransactionEntity[]
}

export const setUnidentifiedBankTransactions = (
  unidentifiedBankTransactions: BankTransactionEntity[]
): any => {
  return {
    type: SET_UNIDENTIFIED_BANK_TRANSACTIONS,
    payload: {
      unidentifiedBankTransactions,
    },
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: ReportDataState = {
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0],
  transactionsByCategory: {},
  unidentifiedBankTransactions: [],
  total: 0,
};

export const reportDataStateReducer = (
  state: ReportDataState = initialState,
  action: TrackerModelBaseAction<SetStatementDataPayload & SetTransactionsByCategoryPayload & SetUnidentifiedBankTransactionsPayload>
): ReportDataState => {
  switch (action.type) {
    case SET_STATEMENT_DATA: {
      return { ...state, startDate: action.payload.startDate, endDate: action.payload.endDate, total: action.payload.total };
    }
    case SET_TRANSACTIONS_BY_CATEGORY: {
      return { ...state, transactionsByCategory: action.payload.transactionsByCategory };
    }
    case SET_UNIDENTIFIED_BANK_TRANSACTIONS: {
      return { ...state, unidentifiedBankTransactions: action.payload.unidentifiedBankTransactions };
    } 
    default:
      return state;
  }
};
