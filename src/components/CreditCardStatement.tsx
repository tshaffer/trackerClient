import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TrackerDispatch } from '../models';
import { Statement, Transaction } from '../types';
import { getCreditCardStatementById, getCreditCardStatementId, getTransactions, getTransactionsByStatementId } from '../selectors';
import { formatCurrency, formatDate } from '../utilities';

import '../styles/Grid.css';
import { loadTransactions } from '../controllers';
import { isNil } from 'lodash';

interface CreditCardStatementProps {
  creditCardStatementId: string;
  creditCardStatement: Statement | null;
  transactions: Transaction[];
  onLoadTransactions: (startDate: string, endDate: string, includeCreditCardTransactions: boolean, includeCheckingAccountTransactions: boolean) => any;
}

const CreditCardStatement: React.FC<CreditCardStatementProps> = (props: CreditCardStatementProps) => {

  React.useEffect(() => {
    console.log('CreditCardStatement: useEffect');
    console.log(props.creditCardStatementId)
    const creditCardStatement: Statement | null = props.creditCardStatement
    if (!isNil(creditCardStatement)) {
      props.onLoadTransactions(creditCardStatement.startDate, creditCardStatement.endDate, true, false);
    }
  }, []);

  console.log('render CreditCardStatement', props.creditCardStatementId);

  // columns
  //    date
  //    amount
  //    user description
  return (
    <React.Fragment>
      <div className="statement-grid-table-container">
        <div className="grid-table-header">
          <div className="grid-table-cell"></div>
          <div className="grid-table-cell">Date</div>
          <div className="grid-table-cell">Amount</div>
          <div className="grid-table-cell">Description</div>
        </div>
        <div className="grid-table-body">
          {props.transactions.map((transaction: Transaction) => (
            <div className="grid-table-row" key={transaction.id}>
              <div className="grid-table-cell"></div>
              <div className="grid-table-cell">{formatDate(transaction.transactionDate)}</div>
              <div className="grid-table-cell">{formatCurrency(transaction.amount)}</div>
              <div className="grid-table-cell">{transaction.userDescription}</div>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}

function mapStateToProps(state: any) {
  return {
    creditCardStatementId: getCreditCardStatementId(state),
    creditCardStatement: getCreditCardStatementById(state, getCreditCardStatementId(state)),
    transactions: getTransactionsByStatementId(state, getCreditCardStatementId(state)),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
    onLoadTransactions: loadTransactions,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CreditCardStatement);

