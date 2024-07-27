import { cloneDeep } from 'lodash';
import { CreditCardStatement, CreditCardStatementState } from '../types';
import { TrackerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_CREDIT_CARD_STATEMENTS = 'ADD_CREDIT_CARD_STATEMENTS';
export const SET_CREDIT_CARD_STATEMENT_ID = 'SET_CREDIT_CARD_STATEMENT_ID';

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

interface SetCreditCardStatementIdPayload {
  creditCardStatementId: string;
}

export const setCreditCardStatementId = (
  creditCardStatementId: string
): any => {
  return {
    type: SET_CREDIT_CARD_STATEMENT_ID,
    payload: {
      creditCardStatementId
    }
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: CreditCardStatementState = {
  creditCardStatements: [],
  creditCardStatementId: '',
};

export const creditCardStatementStateReducer = (
  state: CreditCardStatementState = initialState,
  action: TrackerModelBaseAction<AddCreditCardStatementsPayload & SetCreditCardStatementIdPayload>
): CreditCardStatementState => {
  switch (action.type) {
    case ADD_CREDIT_CARD_STATEMENTS: {
      return { ...state, creditCardStatements: action.payload.creditCardStatements };
    }
    case SET_CREDIT_CARD_STATEMENT_ID: {
      return { ...state, creditCardStatementId: action.payload.creditCardStatementId };
    }
    default:
      return state;
  }
};
