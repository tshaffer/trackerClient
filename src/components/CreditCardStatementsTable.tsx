import React from 'react';

import '../styles/Grid.css';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isEmpty } from 'lodash';

import { CreditCardStatementEntity } from '../types';
import { TrackerDispatch } from '../models';
import { getCreditCardStatements } from '../selectors';
import { formatCurrency, formatDate } from '../utilities';

interface CreditCardStatementsTableProps {
  statements: CreditCardStatementEntity[];
}

const CreditCardStatementsTable: React.FC<CreditCardStatementsTableProps> = (props: CreditCardStatementsTableProps) => {

  if (isEmpty(props.statements)) {
    return null;
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
          <div className="grid-table-cell">Net Spent</div>
        </div>
        <div className="grid-table-body">
          {props.statements.map((statement: CreditCardStatementEntity) => (
            <div className="grid-table-row" key={statement.id}>
              <div className="grid-table-cell"></div>
              <div className="grid-table-cell">{statement.fileName}</div>
              <div className="grid-table-cell">{formatDate(statement.startDate)}</div>
              <div className="grid-table-cell">{formatDate(statement.endDate)}</div>
              <div className="grid-table-cell">{statement.transactionCount}</div>
              <div className="grid-table-cell">{formatCurrency(statement.netSpent)}</div>
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
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CreditCardStatementsTable);
