import { CheckingAccountStatementEntity, TrackerState } from '../types';

export const getCheckingAccountStatements = (state: TrackerState): CheckingAccountStatementEntity[] => {
  return state.checkingAccountStatementState.checkingAccountStatements;
};

