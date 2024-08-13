// store.js
import { configureStore } from '@reduxjs/toolkit';
import { rootyReducer } from "./baselessReducer";
import { categoryAssignmentRulesStateReducer } from './categoryAssignmentRulesState';
import { categoryStateReducer } from './categoryState';
import { checkingAccountStatementStateReducer } from './checkingAccountStatementState';
import { creditCardStatementStateReducer } from './creditCardStatementState';
import { reportDataStateReducer } from './reportDataState';
import { transactionsStateReducer } from './transactionsState';
export const store = configureStore({
  reducer: {
    reportDataState: reportDataStateReducer,
    categoryState: categoryStateReducer,
    categoryAssignmentRulesState: categoryAssignmentRulesStateReducer,
    checkingAccountStatementState: checkingAccountStatementStateReducer,
    creditCardStatementState: creditCardStatementStateReducer,
    transactionsState: transactionsStateReducer,
  }
});

export const xstore = configureStore({
  reducer: {
    categories: categoryStateReducer,
    categoryAssignmentRules: categoryAssignmentRulesReducer,
    statements: statementsReducer,
  },
});
export default store;