import { StringToTransactionsLUT } from "./base";

export interface TrackerState {
  appState: AppState;
  reportDataState: ReportDataState;
}

export interface AppState {
  appInitialized: boolean;
}

export interface ReportDataState {
  transactionsByCategory: StringToTransactionsLUT;
  
}