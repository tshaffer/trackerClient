import { cloneDeep } from 'lodash';
import { CheckingAccountStatementEntity, CheckingAccountStatementState } from '../types';
import { TrackerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_CHECKING_ACCOUNT_STATEMENTS = 'ADD_CHECKING_ACCOUNT_STATEMENTS';

// ------------------------------------
// Actions
// ------------------------------------

interface AddCheckingAccountStatementsPayload {
  checkingAccountStatements: CheckingAccountStatementEntity[];
}

export const addCheckingAccountStatements = (
  checkingAccountStatements: CheckingAccountStatementEntity[],
): any => {
  return {
    type: ADD_CHECKING_ACCOUNT_STATEMENTS,
    payload: {
      checkingAccountStatements
    }
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: CheckingAccountStatementState = {
  checkingAccountStatements: [],
};

export const checkingAccountStatementStateReducer = (
  state: CheckingAccountStatementState = initialState,
  action: TrackerModelBaseAction<AddCheckingAccountStatementsPayload>
): CheckingAccountStatementState => {
  switch (action.type) {
    case ADD_CHECKING_ACCOUNT_STATEMENTS: {
      const newState = cloneDeep(state) as CheckingAccountStatementState;
      newState.checkingAccountStatements = newState.checkingAccountStatements.concat(action.payload.checkingAccountStatements);
      return newState;
    }
    default:
      return state;
  }
};
