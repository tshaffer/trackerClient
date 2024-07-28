import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainContent from './MainContent';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { loadCategories, loadCategoryAssignmentRules, loadCheckingAccountStatements, loadCreditCardStatements, loadMinMaxTransactionDates } from '../controllers';
import { TrackerDispatch, setAppInitialized } from '../models';
import { getAppInitialized } from '../selectors';

import { initializeServer } from '../controllers/app';
import CreditCardStatement from './CreditCardStatement';

export interface AppProps {
  appInitialized: boolean;
  onInitializeServer: () => any;
  onLoadCategories: () => any;
  onLoadCategoryAssignmentRules: () => any;
  onLoadCreditCardStatements: () => any;
  onLoadCheckingAccountStatements: () => any;
  onLoadMinMaxTransactionDates: () => any;
  onSetAppInitialized: () => any;
}

const App = (props: AppProps) => {

  React.useEffect(() => {
    if (!props.appInitialized) {
      props.onInitializeServer()
        .then(() => {
          return props.onLoadCategories();
        })
        .then(() => {
          return props.onLoadCategoryAssignmentRules();
        })
        .then(() => {
          return props.onLoadCreditCardStatements();
        })
        .then(() => {
          return props.onLoadCheckingAccountStatements();
        })
        .then(() => {
          return props.onLoadMinMaxTransactionDates();
        })
        .then(() => {
          console.log('invoke onSetAppInitialized');
          return props.onSetAppInitialized();
        })
    }
  }, [props.appInitialized]);

  if (!props.appInitialized) {
    return null;
  }

  return (
    <Routes>
      <Route path="/" element={<MainContent />} />
      <Route path="/creditCardStatement/:id" element={<CreditCardStatement />} />
    </Routes>
  );

};

function mapStateToProps(state: any) {
  return {
    appInitialized: getAppInitialized(state),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
    onSetAppInitialized: setAppInitialized,
    onInitializeServer: initializeServer,
    onLoadCategories: loadCategories,
    onLoadCategoryAssignmentRules: loadCategoryAssignmentRules,
    onLoadCreditCardStatements: loadCreditCardStatements,
    onLoadCheckingAccountStatements: loadCheckingAccountStatements,
    onLoadMinMaxTransactionDates: loadMinMaxTransactionDates
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
