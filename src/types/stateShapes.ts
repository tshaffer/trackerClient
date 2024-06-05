import { StringToTransactionsLUT } from "./base";
import { CategoryEntity, CategoryKeywordEntity } from "./entities";

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
  total: number;
}

export interface CategoryState {
  categories: CategoryEntity[];
  categoryKeywords: CategoryKeywordEntity[];
}
