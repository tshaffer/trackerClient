import { BankTransactionEntity, DateRangeType, MinMaxDates, ReportDataState, StringToTransactionsLUT, TrackerState } from "../types";

export const getReportDataState = (state: TrackerState): ReportDataState => {
  return state.reportDataState;
};

export const getStartDate = (state: TrackerState): string => {
  return state.reportDataState.startDate;
}

export const getEndDate = (state: TrackerState): string => {
  return state.reportDataState.endDate;
}

export const getTotal = (state: TrackerState): number => {
  return state.reportDataState.total;
}

export const getTransactionsByCategory = (state: TrackerState): StringToTransactionsLUT => {
  return state.reportDataState.transactionsByCategory;
};

export const getUnidentifiedBankTransactions = (state: TrackerState): BankTransactionEntity[] => {
  return state.reportDataState.unidentifiedBankTransactions;
};

export const getUnidentifiedBankTransactionById = (state: TrackerState, unidentifiedBankTransactionId: string): BankTransactionEntity | null => {
  return state.reportDataState.unidentifiedBankTransactions.find((unidentifiedBankTransaction: BankTransactionEntity) => unidentifiedBankTransaction.id === unidentifiedBankTransactionId) || null;
};

export const getDateRangeType = (state: TrackerState): DateRangeType => {
  return state.reportDataState.dateRangeType;
}

export const getMinMaxTransactionDates = (state: TrackerState): MinMaxDates => {
  return state.reportDataState.minMaxTransactionDates;
}
