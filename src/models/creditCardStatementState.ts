import { cloneDeep } from 'lodash';
import { CreditCardStatement, CreditCardStatementState } from '../types';
import { TrackerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_CREDIT_CARD_STATEMENTS = 'ADD_CREDIT_CARD_STATEMENTS';

// ------------------------------------
// Actions
// ------------------------------------

interface AddCreditCardStatementsPayload {
  creditCardStatements: CreditCardStatement[];
}

export const addCreditCardStatements = (
  creditCardStatements: CreditCardStatement[],
): any => {
  return {
    type: ADD_CREDIT_CARD_STATEMENTS,
    payload: {
      creditCardStatements
    }
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: CreditCardStatementState = {
  creditCardStatements: [],
};

export const creditCardStatementStateReducer = (
  state: CreditCardStatementState = initialState,
  action: TrackerModelBaseAction<AddCreditCardStatementsPayload>
): CreditCardStatementState => {
  switch (action.type) {
    case ADD_CREDIT_CARD_STATEMENTS: {
      return { ...state, creditCardStatements: action.payload.creditCardStatements };
    }
    default:
      return state;
  }
};
