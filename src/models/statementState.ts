import { cloneDeep } from 'lodash';
import { StatementEntity, StatementState } from '../types';
import { TrackerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_STATEMENTS = 'ADD_STATEMENTS';

// ------------------------------------
// Actions
// ------------------------------------

interface AddStatementsPayload {
  statements: StatementEntity[];
}

export const addStatements = (
  statements: StatementEntity[],
): any => {
  return {
    type: ADD_STATEMENTS,
    payload: {
      statements
    }
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: StatementState = {
  statements: [],
};

export const statementStateReducer = (
  state: StatementState = initialState,
  action: TrackerModelBaseAction<AddStatementsPayload>
): StatementState => {
  switch (action.type) {
    case ADD_STATEMENTS: {
      const newState = cloneDeep(state) as StatementState;
      newState.statements = newState.statements.concat(action.payload.statements);
      return newState;
    }
    default:
      return state;
  }
};
