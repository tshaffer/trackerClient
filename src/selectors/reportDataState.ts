import { ReportDataState, StringToTransactionsLUT, TrackerState } from "../types";

export const getReportDataState = (state: TrackerState): ReportDataState => {
  return state.reportDataState;
};

export const getTransactionsByCategory = (state: TrackerState): StringToTransactionsLUT => {
  return state.reportDataState.transactionsByCategory;
};

