import React from 'react';

import '../styles/Tracker.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isEmpty } from 'lodash';

import { CheckingAccountStatementEntity, StatementType } from '../types';
import { TrackerDispatch } from '../models';
import { getCheckingAccountStatements } from '../selectors';
import { formatCurrency, formatDate } from '../utilities';

interface CheckingAccountStatementsTableProps {
  statements: CheckingAccountStatementEntity[];
}

const CheckingAccountStatementsTable: React.FC<CheckingAccountStatementsTableProps> = (props: CheckingAccountStatementsTableProps) => {

  if (isEmpty(props.statements)) {
    return null;
  }

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
            <div className="table-cell">Net Spent</div>
            <div className="table-cell"># of checks</div>
            <div className="table-cell"># of ATM withdrawals</div>
          </div>
        </div>
        <div className="table-body">
          {props.statements.map((statement: CheckingAccountStatementEntity) => (
            <React.Fragment key={statement.id}>
              <div className="table-row">
                <div className="table-cell"></div>
                <div className="table-cell">{statement.fileName}</div>
                <div className="table-cell">{formatDate(statement.startDate)}</div>
                <div className="table-cell">{formatDate(statement.endDate)}</div>
                <div className="table-cell">{statement.transactionCount}</div>
                <div className="table-cell">{formatCurrency(statement.netSpent)}</div>
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
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckingAccountStatementsTable);
