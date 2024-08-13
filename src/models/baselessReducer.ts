/** @module Model:base */

import { appStateReducer } from './appState';
import { reportDataStateReducer } from './reportDataState';
import { categoryStateReducer } from './categoryState';
import { checkingAccountStatementStateReducer } from './checkingAccountStatementState';
import { creditCardStatementStateReducer } from './creditCardStatementState';
import { transactionsStateReducer } from './transactionsState';
import { categoryAssignmentRulesStateReducer } from './categoryAssignmentRulesState';

// -----------------------------------------------------------------------
// Reducers
// -----------------------------------------------------------------------
export const rootyReducer = {
  {
  appState: appStateReducer,
    reportDataState: reportDataStateReducer,
      categoryState: categoryStateReducer,
        categoryAssignmentRulesState: categoryAssignmentRulesStateReducer,
          checkingAccountStatementState: checkingAccountStatementStateReducer,
            creditCardStatementState: creditCardStatementStateReducer,
              transactionsState: transactionsStateReducer,
  
};

// -----------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------

