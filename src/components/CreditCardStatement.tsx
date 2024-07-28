import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { TrackerDispatch, setCreditCardStatementId } from '../models';
import { CreditCardTransaction, Statement } from '../types';
import { getCreditCardStatementById, getCreditCardStatementId, getTransactionsByStatementId } from '../selectors';

import '../styles/Grid.css';
import { loadTransactions } from '../controllers';
import { isNil } from 'lodash';
import CreditCardStatementTransactionRow from './CreditCardStatementTransactionRow';
import { Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

interface CreditCardStatementProps {
  creditCardStatementId: string;
  creditCardStatement: Statement | null;
  creditCardTransactions: CreditCardTransaction[];
  onLoadTransactions: (startDate: string, endDate: string, includeCreditCardTransactions: boolean, includeCheckingAccountTransactions: boolean) => any;
  onSetCreditCardStatementId: (creditCardStatementId: string) => any;
}

const CreditCardStatement: React.FC<CreditCardStatementProps> = (props: CreditCardStatementProps) => {

  React.useEffect(() => {
    console.log('CreditCardStatement: useEffect');
    const creditCardStatement: Statement | null = props.creditCardStatement
    if (!isNil(creditCardStatement)) {
      props.onLoadTransactions(creditCardStatement.startDate, creditCardStatement.endDate, true, false);
    }
  }, []);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  console.log('render CreditCardStatement', id);

  // columns
  //    date
  //    amount
  //    user description
  return (
    <React.Fragment>
      <Button onClick={() => navigate('/')}>Back to Home</Button>
      <div>{props.creditCardStatementId}</div>
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

function mapStateToProps(state: any) {
  const { id } = useParams<{ id: string }>();
  return {
    creditCardStatementId: getCreditCardStatementId(state),
    creditCardStatement: getCreditCardStatementById(state, id as string),
    creditCardTransactions: getTransactionsByStatementId(state, id as string) as CreditCardTransaction[],
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
    onLoadTransactions: loadTransactions,
    onSetCreditCardStatementId: setCreditCardStatementId,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CreditCardStatement);

