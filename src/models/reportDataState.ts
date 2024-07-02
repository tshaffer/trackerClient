import { BankTransaction, DateRangeType, MinMaxDates, ReportDataState, StringToTransactionsLUT } from '../types';
import { getCurrentDate, getRetirementDate } from '../utilities';
import { TrackerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_STATEMENT_DATA = 'SET_STATEMENT_DATA';
export const SET_TRANSACTIONS_BY_CATEGORY = 'SET_TRANSACTIONS_BY_CATEGORY';
export const SET_UNIDENTIFIED_BANK_TRANSACTIONS = 'SET_UNIDENTIFIED_BANK_TRANSACTIONS';
export const SET_DATE_RANGE_TYPE = 'SET_DATE_RANGE_TYPE';
export const SET_START_DATE = 'SET_START_DATE';
export const SET_END_DATE = 'SET_END_DATE';
export const SET_GENERATED_REPORT_START_DATE = 'SET_GENERATED_REPORT_START_DATE';
export const SET_GENERATED_REPORT_END_DATE = 'SET_GENERATED_REPORT_END_DATE';
export const SET_MIN_MAX_TRANSACTION_DATES = 'SET_MIN_MAX_TRANSACTION_DATES';

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
  unidentifiedBankTransactions: BankTransaction[]
}

export const setUnidentifiedBankTransactions = (
  unidentifiedBankTransactions: BankTransaction[]
): any => {
  return {
    type: SET_UNIDENTIFIED_BANK_TRANSACTIONS,
    payload: {
      unidentifiedBankTransactions,
    },
  };
};

interface SetDateRangeTypePayload {
  dateRangeType: DateRangeType
}

export const setDateRangeType = (
  dateRangeType: DateRangeType
): any => {
  return {
    type: SET_DATE_RANGE_TYPE,
    payload: {
      dateRangeType,
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

interface SetGeneratedReportStartDatePayload {
  generatedReportStartDate: string;
}

export const setGeneratedReportStartDate = (
  generatedReportStartDate: string
): any => {
  return {
    type: SET_GENERATED_REPORT_START_DATE,
    payload: {
      generatedReportStartDate,
    },
  };
};

interface SetGeneratedReportEndDatePayload {
  generatedReportEndDate: string;
}

export const setGeneratedReportEndDate = (
  generatedReportEndDate: string
): any => {
  return {
    type: SET_GENERATED_REPORT_END_DATE,
    payload: {
      generatedReportEndDate,
    },
  };
};

interface SetMinMaxTransactionDatesPayload {
  minMaxTransactionDates: MinMaxDates;
}

export const setMinMaxTransactionDates = (
  minMaxTransactionDates: MinMaxDates
): any => {
  return {
    type: SET_MIN_MAX_TRANSACTION_DATES,
    payload: {
      minMaxTransactionDates
    }
  };
};


// ------------------------------------
// Reducer
// ------------------------------------

const initialState: ReportDataState = {
  dateRangeType: DateRangeType.SinceRetirement,
  startDate: getRetirementDate(),
  endDate: getCurrentDate(),
  generatedReportStartDate: new Date().toISOString().split('T')[0],
  generatedReportEndDate: new Date().toISOString().split('T')[0],
  transactionsByCategory: {},
  unidentifiedBankTransactions: [],
  total: 0,
  minMaxTransactionDates: { minDate: '', maxDate: '' },
};

export const reportDataStateReducer = (
  state: ReportDataState = initialState,
  action: TrackerModelBaseAction<SetStatementDataPayload & SetTransactionsByCategoryPayload & SetUnidentifiedBankTransactionsPayload & SetDateRangeTypePayload & SetStartDatePayload & SetEndDatePayload & SetGeneratedReportStartDatePayload & SetGeneratedReportEndDatePayload & SetMinMaxTransactionDatesPayload>
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
    case SET_DATE_RANGE_TYPE: {
      return { ...state, dateRangeType: action.payload.dateRangeType };
    }
    case SET_START_DATE: {
      return { ...state, startDate: action.payload.startDate };
    }
    case SET_END_DATE: {
      return { ...state, endDate: action.payload.endDate };
    }
    case SET_GENERATED_REPORT_START_DATE: {
      return { ...state, generatedReportStartDate: action.payload.generatedReportStartDate };
    }
    case SET_GENERATED_REPORT_END_DATE: {
      return { ...state, generatedReportEndDate: action.payload.generatedReportEndDate };
    }
    case SET_MIN_MAX_TRANSACTION_DATES: {
      return { ...state, minMaxTransactionDates: action.payload.minMaxTransactionDates };
    }
    default:
      return state;
  }
};
