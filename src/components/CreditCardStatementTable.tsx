import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { TrackerDispatch } from '../models';
import { CreditCardTransaction, Statement } from '../types';
import { getCreditCardStatementById, getTransactionsByStatementId } from '../selectors';

import '../styles/Grid.css';
import { loadTransactions } from '../controllers';
import { isNil } from 'lodash';
import CreditCardStatementTransactionRow from './CreditCardStatementTransactionRow';
import { Button } from '@mui/material';

interface CreditCardStatementTablePropsFromParent {
  creditCardStatementId: string;
  navigate: any;
}

interface CreditCardStatementTableProps extends CreditCardStatementTablePropsFromParent {
  creditCardTransactions: CreditCardTransaction[];
  onLoadTransactions: (startDate: string, endDate: string, includeCreditCardTransactions: boolean, includeCheckingAccountTransactions: boolean) => any;
}

const CreditCardStatementTable: React.FC<CreditCardStatementTableProps> = (props: CreditCardStatementTableProps) => {

  if (isNil(props.creditCardStatementId)) {
    return null;
  }

  console.log('render CreditCardStatementTable', props.creditCardStatementId);

  return (
    <React.Fragment>
      <div className="statement-grid-table-container">
        <div className="grid-table-header">
          <div className="grid-table-cell"></div>
          <div className="grid-table-cell">Date</div>
          <div className="grid-table-cell">Amount</div>
          <div className="grid-table-cell">Description</div>
          <div className="grid-table-cell">Category from statement</div>
          <div className="grid-table-cell"></div>
          <div className="grid-table-cell">Category from rule</div>
          <div className="grid-table-cell">Pattern</div>
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
    onLoadTransactions: loadTransactions,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CreditCardStatementTable);

