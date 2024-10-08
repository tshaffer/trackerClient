import { cloneDeep } from 'lodash';
import { CheckingAccountStatement, CheckingAccountStatementState } from '../types';
import { TrackerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_CHECKING_ACCOUNT_STATEMENTS = 'ADD_CHECKING_ACCOUNT_STATEMENTS';

// ------------------------------------
// Actions
// ------------------------------------

interface AddCheckingAccountStatementsPayload {
  checkingAccountStatements: CheckingAccountStatement[];
}

export const addCheckingAccountStatements = (
  checkingAccountStatements: CheckingAccountStatement[],
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
      return { ...state, checkingAccountStatements: action.payload.checkingAccountStatements };
    }
    default:
      return state;
  }
};
