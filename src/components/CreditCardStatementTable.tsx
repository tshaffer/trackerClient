import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useNavigate } from 'react-router-dom';

import '../styles/Grid.css';

import { Button } from '@mui/material';

import { isNil } from 'lodash';

import { TrackerDispatch } from '../models';
import { CreditCardTransaction } from '../types';
import { getTransactionsByStatementId } from '../selectors';

import CreditCardStatementTransactionRow from './CreditCardStatementTransactionRow';

interface CreditCardStatementTablePropsFromParent {
  creditCardStatementId: string;
  navigate: any;
}

interface CreditCardStatementTableProps extends CreditCardStatementTablePropsFromParent {
  creditCardTransactions: CreditCardTransaction[];
}

const CreditCardStatementTable: React.FC<CreditCardStatementTableProps> = (props: CreditCardStatementTableProps) => {

  if (isNil(props.creditCardStatementId)) {
    return null;
  }

  const navigate = useNavigate();

  console.log('render CreditCardStatementTable', props.creditCardStatementId);

  return (
    <React.Fragment>
      <Button onClick={() => navigate(-1)}>Back</Button>
      <div className="credit-card-statement-grid-table-container">
        <div className="grid-table-header">
          <div className="grid-table-cell"></div>
          <div className="grid-table-cell">Date</div>
          <div className="grid-table-cell">Amount</div>
          <div className="grid-table-cell">Description</div>
          <div className="grid-table-cell"></div>
          <div className="grid-table-cell">User Description</div>
          <div className="grid-table-cell">Category from statement</div>
          <div className="grid-table-cell"></div>
          <div className="grid-table-cell">Category (rule)</div>
          <div className="grid-table-cell">Pattern</div>
          <div className="grid-table-cell">Category (override)</div>
          <div className="grid-table-cell">Category</div>
        </div>
        <div className="grid-table-body">
          {props.creditCardTransactions.map((creditCardTransaction: CreditCardTransaction) => (
            <div className="grid-table-row" key={creditCardTransaction.id}>
              <CreditCardStatementTransactionRow creditCardTransactionId={creditCardTransaction.id} />
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}

function mapStateToProps(state: any, ownProps: CreditCardStatementTablePropsFromParent) {
  return {
    creditCardTransactions: getTransactionsByStatementId(state, ownProps.creditCardStatementId) as CreditCardTransaction[],
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CreditCardStatementTable);

