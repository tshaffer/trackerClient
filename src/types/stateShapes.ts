import { StringToTransactionsLUT } from "./base";
import { BankTransactionEntity, CategoryEntity, CategoryKeywordEntity, StatementEntity } from "./entities";
import { ExpenseReportDateRangeType } from "./enums";

export interface TrackerState {
  appState: AppState;
  categoryState: CategoryState;
  reportDataState: ReportDataState;
  statementState: StatementState;
}

export interface AppState {
  appInitialized: boolean;
}

export interface ReportDataState {
  expenseReportDateRangeType: ExpenseReportDateRangeType;
  startDate: string;
  endDate: string;
  transactionsByCategory: StringToTransactionsLUT;
  unidentifiedBankTransactions: BankTransactionEntity[];
  total: number;
}

export interface CategoryState {
  categories: CategoryEntity[];
  categoryKeywords: CategoryKeywordEntity[];
}

export interface StatementState {
  statements: StatementEntity[];
}
