import { StatementEntity, TrackerState } from '../types';

export const getStatements = (state: TrackerState): StatementEntity[] => {
  return state.statementState.statements;
};

