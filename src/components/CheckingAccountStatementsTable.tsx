import React from 'react';

import '../styles/Tracker.css';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isEmpty } from 'lodash';

import { CheckingAccountStatement } from '../types';
import { TrackerDispatch } from '../models';
import { getCheckingAccountStatements } from '../selectors';
import { formatCurrency, formatDate } from '../utilities';
import { useNavigate, useParams } from 'react-router-dom';
import CheckingAccountStatementTable from './CheckingAccountStatementTable';
import { loadTransactions } from '../controllers';

interface CheckingAccountStatementsTableProps {
  statements: CheckingAccountStatement[];
  onLoadTransactions: (startDate: string, endDate: string, includeCreditCardTransactions: boolean, includeCheckingAccountTransactions: boolean) => any;
}

const CheckingAccountStatementsTable: React.FC<CheckingAccountStatementsTableProps> = (props: CheckingAccountStatementsTableProps) => {

  if (isEmpty(props.statements)) {
    return null;
  }

  const navigate = useNavigate();

  const handleStatementClicked = (checkingAccountStatement: CheckingAccountStatement) => {
    console.log('navigate to credit card statement', checkingAccountStatement.id);
    props.onLoadTransactions(checkingAccountStatement.startDate, checkingAccountStatement.endDate, false, true)
      .then(() => {
        navigate(`/checkingAccountStatement/${checkingAccountStatement.id}`);
      });
  }

  const sortedStatements: CheckingAccountStatement[] = props.statements.sort((a, b) => b.endDate.localeCompare(a.endDate));

  return (
    <React.Fragment>
      <div className="table-container">
        <div className="table-header">
          <div className="table-row">
            <div className="table-cell"></div>
            <div className="table-cell">Name</div>
            <div className="table-cell">Start Date</div>
            <div className="table-cell">End Date</div>
            <div className="table-cell">Transaction Count</div>
            <div className="table-cell">Net Debits</div>
            <div className="table-cell"># of checks</div>
            <div className="table-cell"># of ATM withdrawals</div>
          </div>
        </div>
        <div className="table-body">
          {sortedStatements.map((statement: CheckingAccountStatement) => (
            <React.Fragment key={statement.id}>
              <div className="table-row">
                <div className="table-cell"></div>
                <div
                  className="grid-table-cell-clickable"
                  onClick={() => handleStatementClicked(statement)}
                >
                  {statement.fileName}
                </div>
                <div className="table-cell">{formatDate(statement.startDate)}</div>
                <div className="table-cell">{formatDate(statement.endDate)}</div>
                <div className="table-cell">{statement.transactionCount}</div>
                <div className="table-cell">{formatCurrency(statement.netDebits)}</div>
                <div className="table-cell">{statement.checkCount}</div>
                <div className="table-cell">{statement.atmWithdrawalCount}</div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </React.Fragment >
  );
};


function mapStateToProps(state: any) {
  return {
    statements: getCheckingAccountStatements(state),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
    onLoadTransactions: loadTransactions,
  }, dispatch);
};

export const CheckingAccountStatementTableWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  return <CheckingAccountStatementTable checkingAccountStatementId={id as string} navigate={navigate} />;
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckingAccountStatementsTable);
