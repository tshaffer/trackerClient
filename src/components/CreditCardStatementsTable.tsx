import React from 'react';

import '../styles/Grid.css';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isEmpty } from 'lodash';

import { CreditCardStatement } from '../types';
import { TrackerDispatch } from '../models';
import { getCreditCardStatements } from '../selectors';
import { formatCurrency, formatDate } from '../utilities';
import { useNavigate, useParams } from 'react-router-dom';
import { loadTransactions } from '../controllers';
import CreditCardStatementTable from './CreditCardStatementTable';

interface CreditCardStatementsTableProps {
  statements: CreditCardStatement[];
  onLoadTransactions: (startDate: string, endDate: string, includeCreditCardTransactions: boolean, includeCheckingAccountTransactions: boolean) => any;
}

const CreditCardStatementsTable: React.FC<CreditCardStatementsTableProps> = (props: CreditCardStatementsTableProps) => {

  if (isEmpty(props.statements)) {
    return null;
  }

  const navigate = useNavigate();

  const handleStatementClicked = (creditCardStatement: CreditCardStatement) => {
    console.log('navigate to credit card statement', creditCardStatement.id);
    props.onLoadTransactions(creditCardStatement.startDate, creditCardStatement.endDate, true, false)
      .then(() => {
        navigate(`/creditCardStatement/${creditCardStatement.id}`);
      });
  }

  return (
    <React.Fragment>
      <div className="grid-table-container">
        <div className="grid-table-header">
          <div className="grid-table-cell"></div>
          <div className="grid-table-cell">Name</div>
          <div className="grid-table-cell">Start Date</div>
          <div className="grid-table-cell">End Date</div>
          <div className="grid-table-cell">Transaction Count</div>
          <div className="grid-table-cell">Net Debits</div>
        </div>
        <div className="grid-table-body">
          {props.statements.map((statement: CreditCardStatement) => (
            <div className="grid-table-row" key={statement.id}>
              <div className="grid-table-cell"></div>
              <div
                className="grid-table-cell-clickable"
                onClick={() => handleStatementClicked(statement)}
              >
                {statement.fileName}
              </div>
              <div className="grid-table-cell">{formatDate(statement.startDate)}</div>
              <div className="grid-table-cell">{formatDate(statement.endDate)}</div>
              <div className="grid-table-cell">{statement.transactionCount}</div>
              <div className="grid-table-cell">{formatCurrency(statement.netDebits)}</div>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};


function mapStateToProps(state: any) {
  return {
    statements: getCreditCardStatements(state),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
    onLoadTransactions: loadTransactions,
  }, dispatch);
};

export const CreditCardStatementTableWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  return <CreditCardStatementTable creditCardStatementId={id as string} navigate={navigate} />;
};


export default connect(mapStateToProps, mapDispatchToProps)(CreditCardStatementsTable);
