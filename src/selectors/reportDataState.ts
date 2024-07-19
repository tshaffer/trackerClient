import { isNil } from "lodash";
import { BankTransaction, DateRangeType, MinMaxDates, ReportDataState, StringToTransactionsLUT, Statement, TrackerState, CategorizedTransaction } from "../types";
import { getCheckingAccountStatementById } from "./checkingAccountStatementState";
import { getCreditCardStatementById } from "./creditCardStatementState";

export const getReportDataState = (state: TrackerState): ReportDataState => {
  return state.reportDataState;
};

export const getStartDate = (state: TrackerState): string => {
  return state.reportDataState.startDate;
}

export const getEndDate = (state: TrackerState): string => {
  return state.reportDataState.endDate;
}

export const getGeneratedReportStartDate = (state: TrackerState): string => {
  return state.reportDataState.generatedReportStartDate;
}

export const getGeneratedReportEndDate = (state: TrackerState): string => {
  return state.reportDataState.generatedReportEndDate;
}

export const getTotal = (state: TrackerState): number => {
  return state.reportDataState.total;
}

export const getTransactionsByCategory = (state: TrackerState): StringToTransactionsLUT => {
  return state.reportDataState.transactionsByCategory;
};

export const getUnidentifiedBankTransactions = (state: TrackerState): BankTransaction[] => {
  return state.reportDataState.unidentifiedBankTransactions;
};

// export const getTransactionById = (state: TrackerState, transactionId: string): BankTransaction | null => {
//   const transactionsByCategory: StringToTransactionsLUT = getTransactionsByCategory(state);
//   const categorizedTransactions: CategorizedTransaction[] = Object.values(transactionsByCategory).flat();
//   const matchingCategorizedTransaction: CategorizedTransaction | null = categorizedTransactions.find((categorizedTransaction: CategorizedTransaction) => categorizedTransaction.bankTransaction.id === transactionId) || null;
//   if (!isNil(matchingCategorizedTransaction)) {
//     return matchingCategorizedTransaction.bankTransaction;
//   } else {
//     return getUnidentifiedBankTransactionById(state, transactionId);
//   }
// }

export const getTransactionByIdFromReportDataState = (reportDataState: ReportDataState, transactionId: string): BankTransaction | null => {
  const transactionsByCategory: StringToTransactionsLUT = reportDataState.transactionsByCategory;
  const categorizedTransactions: CategorizedTransaction[] = Object.values(transactionsByCategory).flat();
  const matchingCategorizedTransaction: CategorizedTransaction | null = categorizedTransactions.find((categorizedTransaction: CategorizedTransaction) => categorizedTransaction.bankTransaction.id === transactionId) || null;
  if (!isNil(matchingCategorizedTransaction)) {
    return matchingCategorizedTransaction.bankTransaction;
  } else {
    // return getUnidentifiedBankTransactionByIdFromReportDataState(reportDataState, transactionId);
    return null;
  }
}

export const getUnidentifiedBankTransactionById = (state: TrackerState, unidentifiedBankTransactionId: string): BankTransaction | null => {
  return state.reportDataState.unidentifiedBankTransactions.find((unidentifiedBankTransaction: BankTransaction) => unidentifiedBankTransaction.id === unidentifiedBankTransactionId) || null;
};

export const getDateRangeType = (state: TrackerState): DateRangeType => {
  return state.reportDataState.dateRangeType;
}

export const getMinMaxTransactionDates = (state: TrackerState): MinMaxDates => {
  return state.reportDataState.minMaxTransactionDates;
}

export const getReportStatementId = (state: TrackerState): string => {
  return state.reportDataState.reportStatementId;
}

export const getReportStatement = (state: TrackerState, statementId: string): Statement | null => {
  const creditCardStatement = getCreditCardStatementById(state, statementId);
  if (!isNil(creditCardStatement)) {
    return creditCardStatement;
  }
  const checkingAccountStatement = getCheckingAccountStatementById(state, statementId);
  if (!isNil(checkingAccountStatement)) {
    return checkingAccountStatement;
  }
  return null;
}
