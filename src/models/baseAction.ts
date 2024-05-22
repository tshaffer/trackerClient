import {
  Action,
  AnyAction,
} from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { TrackerState } from '../types';

export interface TrackerBaseAction extends Action {
  type: string;   // override Any - must be a string
  payload: {} | null;
}

export interface TrackerModelBaseAction<T> extends Action {
  type: string;   // override Any - must be a string
  payload: T;
  // error?: boolean;
  // meta?: {};
}

export interface TrackerAction<T> extends TrackerBaseAction {
  payload: T | any;
}

export type TrackerDispatch = ThunkDispatch<TrackerState, undefined, TrackerAction<AnyAction>>;
export type TrackerVoidPromiseThunkAction = (dispatch: TrackerDispatch, getState: () => TrackerState, extraArgument: undefined) => Promise<void>;
export type TrackerAnyPromiseThunkAction = (dispatch: TrackerDispatch, getState: () => TrackerState, extraArgument: undefined) => Promise<any>;
