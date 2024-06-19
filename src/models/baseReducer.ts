/** @module Model:base */

import { combineReducers } from 'redux';
import { TrackerState } from '../types';

import { appStateReducer } from './appState';
import { reportDataStateReducer } from './reportDataState';
import { categoryStateReducer } from './categoryState';
import { checkingAccountStatementStateReducer } from './checkingAccountStatementState';
import { creditCardStatementStateReducer } from './creditCardStatementState';

// -----------------------------------------------------------------------
// Reducers
// -----------------------------------------------------------------------
export const rootReducer = combineReducers<TrackerState>({
  appState: appStateReducer,
  reportDataState: reportDataStateReducer,
  categoryState: categoryStateReducer,
  checkingAccountStatementState: checkingAccountStatementStateReducer,
  creditCardStatementState: creditCardStatementStateReducer,
});

// -----------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------

