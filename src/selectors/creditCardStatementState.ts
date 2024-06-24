import { CreditCardStatement, TrackerState } from '../types';

export const getCreditCardStatements = (state: TrackerState): CreditCardStatement[] => {
  return state.creditCardStatementState.creditCardStatements;
};

