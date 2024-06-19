import { CreditCardStatementEntity, TrackerState } from '../types';

export const getCreditCardStatements = (state: TrackerState): CreditCardStatementEntity[] => {
  return state.creditCardStatementState.creditCardStatements;
};

