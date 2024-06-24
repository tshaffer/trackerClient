import { CheckingAccountStatement, TrackerState } from '../types';

export const getCheckingAccountStatements = (state: TrackerState): CheckingAccountStatement[] => {
  return state.checkingAccountStatementState.checkingAccountStatements;
};

