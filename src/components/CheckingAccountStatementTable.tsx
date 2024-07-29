import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useNavigate } from 'react-router-dom';

import '../styles/Grid.css';

import { Button } from '@mui/material';

import { isNil } from 'lodash';

import { TrackerDispatch } from '../models';
import { CheckingAccountTransaction } from '../types';
import { getTransactionsByStatementId } from '../selectors';

import CheckingAccountStatementTransactionRow from './CheckingAccountStatementTransactionRow';

interface CheckingAccountStatementTablePropsFromParent {
  checkingAccountStatementId: string;
  navigate: any;
}

interface CheckingAccountStatementTableProps extends CheckingAccountStatementTablePropsFromParent {
  checkingAccountTransactions: CheckingAccountTransaction[];
}

const CheckingAccountStatementTable: React.FC<CheckingAccountStatementTableProps> = (props: CheckingAccountStatementTableProps) => {

  if (isNil(props.checkingAccountStatementId)) {
    return null;
  }

  const navigate = useNavigate();

  console.log('render CheckingAccountStatementTable', props.checkingAccountStatementId);


  return (
    <React.Fragment>
      <Button onClick={() => navigate('/checkingAccountStatementsTable')}>Back</Button>
      <div className="checking-account-statement-grid-table-container">
        <div className="grid-table-header">
          <div className="grid-table-cell"></div>
          <div className="grid-table-cell">Date</div>
          <div className="grid-table-cell">Amount</div>
          <div className="grid-table-cell">Description</div>
          <div className="grid-table-cell"></div>
          <div className="grid-table-cell">User Description</div>
          <div className="grid-table-cell"></div>
          <div className="grid-table-cell">Category from rule</div>
          <div className="grid-table-cell">Pattern</div>
        </div>
        <div className="grid-table-body">
          {props.checkingAccountTransactions.map((checkingAccountTransaction: CheckingAccountTransaction) => (
            <div className="grid-table-row" key={checkingAccountTransaction.id}>
              <CheckingAccountStatementTransactionRow checkingAccountTransactionId={checkingAccountTransaction.id} />
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}

function mapStateToProps(state: any, ownProps: CheckingAccountStatementTablePropsFromParent) {
  return {
    checkingAccountTransactions: getTransactionsByStatementId(state, ownProps.checkingAccountStatementId) as CheckingAccountTransaction[],
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckingAccountStatementTable);

