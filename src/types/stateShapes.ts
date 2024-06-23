import { StringToTransactionsLUT } from "./base";
import { BankTransactionEntity, CategoryEntity, CategoryKeywordEntity, CheckingAccountStatementEntity, CreditCardStatementEntity, MinMaxStartDates } from "./entities";
import { ExpenseReportDateRangeType } from "./enums";

export interface TrackerState {
  appState: AppState;
  categoryState: CategoryState;
  reportDataState: ReportDataState;
  checkingAccountStatementState: CheckingAccountStatementState;
  creditCardStatementState: CreditCardStatementState;
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
  minMaxTransactionDates: MinMaxStartDates;
}

export interface CategoryState {
  categories: CategoryEntity[];
  categoryKeywords: CategoryKeywordEntity[];
}

export interface CreditCardStatementState {
  creditCardStatements: CreditCardStatementEntity[];
}

export interface CheckingAccountStatementState {
  checkingAccountStatements: CheckingAccountStatementEntity[];
}
