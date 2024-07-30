/** @module Model:base */

import { combineReducers } from 'redux';
import { TrackerState } from '../types';

import { appStateReducer } from './appState';
import { reportDataStateReducer } from './reportDataState';
import { categoryStateReducer } from './categoryState';
import { checkingAccountStatementStateReducer } from './checkingAccountStatementState';
import { creditCardStatementStateReducer } from './creditCardStatementState';
import { transactionsStateReducer } from './transactionsState';
import { categoryAssignmentRulesStateReducer } from './categoryAssignmentRulesState';

// -----------------------------------------------------------------------
// Reducers
// -----------------------------------------------------------------------
export const rootReducer = combineReducers<TrackerState>({
  appState: appStateReducer,
  reportDataState: reportDataStateReducer,
  categoryState: categoryStateReducer,
  categoryAssignmentRulesState: categoryAssignmentRulesStateReducer,
  checkingAccountStatementState: checkingAccountStatementStateReducer,
  creditCardStatementState: creditCardStatementStateReducer,
  transactionsState: transactionsStateReducer,
});

// -----------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------

