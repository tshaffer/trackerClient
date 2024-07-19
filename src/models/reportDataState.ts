import { cloneDeep, isNil } from 'lodash';
import { BankTransaction, BankTransactionType, CheckTransaction, CreditCardStatement, CreditCardTransaction, DateRangeType, MinMaxDates, ReportDataState, StringToTransactionsLUT, Transaction } from '../types';
import { getCurrentDate, getRetirementDate } from '../utilities';
import { TrackerModelBaseAction } from './baseAction';
import { getTransactionById, getTransactionByIdFromReportDataState } from '../selectors';

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
export const SET_REPORT_STATEMENT_ID = 'SET_REPORT_STATEMENT_ID';
export const UPDATE_CHECK_TRANSACTION = 'UPDATE_CHECK_TRANSACTION';
export const UPDATE_TRANSACTION = 'UPDATE_TRANSACTION';

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

interface SetReportStatementIdPayload {
  reportStatementId: string;
}

export const setReportStatementId = (
  reportStatementId: string
): any => {
  return {
    type: SET_REPORT_STATEMENT_ID,
    payload: {
      reportStatementId,
    },
  };
};

interface UpdateCheckTransactionPayload {
  check: CheckTransaction;
}

export const updateCheckTransactionRedux = (
  check: CheckTransaction
): any => {
  return {
    type: UPDATE_CHECK_TRANSACTION,
    payload: {
      check,
    },
  };
};

interface UpdateTransactionPayload {
  transaction: Transaction;
}

export const old_updateTransactionRedux = (
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
  reportStatementId: '',
};

export const reportDataStateReducer = (
  state: ReportDataState = initialState,
  action: TrackerModelBaseAction<SetStatementDataPayload & SetTransactionsByCategoryPayload & SetUnidentifiedBankTransactionsPayload & SetDateRangeTypePayload & SetStartDatePayload & SetEndDatePayload & SetGeneratedReportStartDatePayload & SetGeneratedReportEndDatePayload & SetMinMaxTransactionDatesPayload & SetReportStatementIdPayload & UpdateCheckTransactionPayload & UpdateTransactionPayload>
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
    case SET_REPORT_STATEMENT_ID: {
      return { ...state, reportStatementId: action.payload.reportStatementId };
    }
    case UPDATE_CHECK_TRANSACTION: {
      const newState = cloneDeep(state);
      newState.unidentifiedBankTransactions = newState.unidentifiedBankTransactions.map((transaction) => {
        if (transaction.id === action.payload.check.id) {
          return action.payload.check;
        }
        return transaction;
      });
      return newState;
    }
    case UPDATE_TRANSACTION: {
      const newState = cloneDeep(state);
      if (action.payload.transaction.bankTransactionType === BankTransactionType.Checking) {
        newState.unidentifiedBankTransactions = newState.unidentifiedBankTransactions.map((transaction) => {
          if (transaction.id === action.payload.transaction.id) {
            return action.payload.transaction as BankTransaction;
          }
          return transaction as BankTransaction;
        });
      } else {
        const transactionsByCategory = newState.transactionsByCategory;
        const transaction: BankTransaction | null = getTransactionByIdFromReportDataState(newState, action.payload.transaction.id);
        if (!isNil(transaction)) {
          const creditCardTransaction: CreditCardTransaction = transaction as CreditCardTransaction;
          const category = creditCardTransaction.category;
          const transactions = transactionsByCategory[category];
          if (transactions) {
            transactions.forEach((categorizedTransaction, i) => {
              if (categorizedTransaction.bankTransaction.id === transaction.id) {
                transactions[i].bankTransaction = action.payload.transaction as BankTransaction;
              }
            });
          }
          transactionsByCategory[category] = transactions;
        }
      }
      return newState;
    }
    default:
      return state;
  }
};
