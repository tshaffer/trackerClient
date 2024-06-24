import { StringToTransactionsLUT } from "./base";
import { BankTransaction, Category, CategoryAssignmentRule, CheckingAccountStatement, CreditCardStatement, MinMaxDates } from "./entities";
import { DateRangeType } from "./enums";

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
  dateRangeType: DateRangeType;
  startDate: string;
  endDate: string;
  transactionsByCategory: StringToTransactionsLUT;
  unidentifiedBankTransactions: BankTransaction[];
  total: number;
  minMaxTransactionDates: MinMaxDates;
}

export interface CategoryState {
  categories: Category[];
  categoryAssignmentRules: CategoryAssignmentRule[];
}

export interface CreditCardStatementState {
  creditCardStatements: CreditCardStatement[];
}

export interface CheckingAccountStatementState {
  checkingAccountStatements: CheckingAccountStatement[];
}
