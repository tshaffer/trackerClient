/** @module Model:base */

import { combineReducers } from 'redux';
import { TrackerState } from '../types';

import { appStateReducer } from './appState';

// -----------------------------------------------------------------------
// Reducers
// -----------------------------------------------------------------------
export const rootReducer = combineReducers<TrackerState>({
  appState: appStateReducer,
});

// -----------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------

