import { AppState } from '../types';
import { TrackerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_APP_INITIALIZED = 'SET_APP_INITIALIZED';

// ------------------------------------
// Actions
// ------------------------------------

export const setAppInitialized = (): any => {
  return {
    type: SET_APP_INITIALIZED,
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: AppState = {
  appInitialized: false,
};

export const appStateReducer = (
  state: AppState = initialState,
  action: TrackerModelBaseAction<any>
): AppState => {
  switch (action.type) {
    case SET_APP_INITIALIZED: {
      return { ...state, appInitialized: true };
    }
    default:
      return state;
  }
};
