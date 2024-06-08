import { StringToTransactionsLUT } from "./base";
import { BankTransactionEntity, CategoryEntity, CategoryKeywordEntity } from "./entities";

export interface TrackerState {
  appState: AppState;
  categoryState: CategoryState;
  reportDataState: ReportDataState;
}

export interface AppState {
  appInitialized: boolean;
}

export interface ReportDataState {
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
