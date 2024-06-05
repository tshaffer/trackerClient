/** @module Model:base */

import { combineReducers } from 'redux';
import { TrackerState } from '../types';

import { appStateReducer } from './appState';
import { reportDataStateReducer } from './reportDataState';
import { categoryStateReducer } from './categoryState';

// -----------------------------------------------------------------------
// Reducers
// -----------------------------------------------------------------------
export const rootReducer = combineReducers<TrackerState>({
  appState: appStateReducer,
  reportDataState: reportDataStateReducer,
  categoryState: categoryStateReducer,
});

// -----------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------

