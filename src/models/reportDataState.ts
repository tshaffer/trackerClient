import { BankTransactionEntity, ExpenseReportDateRangeType, ReportDataState, StringToTransactionsLUT } from '../types';
import { TrackerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_STATEMENT_DATA = 'SET_STATEMENT_DATA';
export const SET_TRANSACTIONS_BY_CATEGORY = 'SET_TRANSACTIONS_BY_CATEGORY';
export const SET_UNIDENTIFIED_BANK_TRANSACTIONS = 'SET_UNIDENTIFIED_BANK_TRANSACTIONS';
export const SET_EXPENSE_REPORT_DATE_RANGE_TYPE = 'SET_EXPENSE_REPORT_DATE_RANGE_TYPE';
export const SET_START_DATE = 'SET_START_DATE';
export const SET_END_DATE = 'SET_END_DATE';

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

interface SetExpenseReportDateRangeTypePayload {
  expenseReportDateRangeType: ExpenseReportDateRangeType
}

export const setExpenseReportDateRangeType = (
  expenseReportDateRangeType: ExpenseReportDateRangeType
): any => {
  return {
    type: SET_EXPENSE_REPORT_DATE_RANGE_TYPE,
    payload: {
      expenseReportDateRangeType,
    },
  };
};

interface SetStartDatePayload {
  startDate: string;
}

export const setStartDate = (
  startDate: string
): any => {
  return {
    type: SET_START_DATE,
    payload: {
      startDate,
    },
  };
};

interface SetEndDatePayload {
  endDate: string;
}

export const setEndDate = (
  endDate: string
): any => {
  return {
    type: SET_END_DATE,
    payload: {
      endDate,
    },
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: ReportDataState = {
  expenseReportDateRangeType: ExpenseReportDateRangeType.All,
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0],
  transactionsByCategory: {},
  unidentifiedBankTransactions: [],
  total: 0,
};

export const reportDataStateReducer = (
  state: ReportDataState = initialState,
  action: TrackerModelBaseAction<SetStatementDataPayload & SetTransactionsByCategoryPayload & SetUnidentifiedBankTransactionsPayload & SetExpenseReportDateRangeTypePayload & SetStartDatePayload & SetEndDatePayload>
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
    case SET_EXPENSE_REPORT_DATE_RANGE_TYPE: {
      return { ...state, expenseReportDateRangeType: action.payload.expenseReportDateRangeType };
    }
    case SET_START_DATE: {
      return { ...state, startDate: action.payload.startDate };
    }
    case SET_END_DATE: {
      return { ...state, endDate: action.payload.endDate };
    }
    default:
      return state;
  }
};
