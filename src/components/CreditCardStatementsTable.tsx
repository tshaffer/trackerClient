import React from 'react';

import '../styles/Tracker.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isEmpty } from 'lodash';

import { CreditCardStatementEntity, StatementType } from '../types';
import { TrackerDispatch } from '../models';
import { getCreditCardStatements } from '../selectors';
import { formatDate } from '../utilities';

interface CreditCardStatementsTableProps {
  statements: CreditCardStatementEntity[];
}

const CreditCardStatementsTable: React.FC<CreditCardStatementsTableProps> = (props: CreditCardStatementsTableProps) => {

  if (isEmpty(props.statements)) {
    return null;
  }

  return (
    <React.Fragment>
      <div className="table-container">
        <div className="table-header">
          <div className="table-row">
            <div className="table-cell"></div>
            <div className="table-cell">Start Date</div>
            <div className="table-cell">End Date</div>
            <div className="table-cell">Type</div>
          </div>
        </div>
        <div className="table-body">
          {props.statements.map((statement: CreditCardStatementEntity) => (
            <React.Fragment key={statement.id}>
              <div className="table-row">
                <div className="table-cell"></div>
                <div className="table-cell">{formatDate(statement.startDate)}</div>
                <div className="table-cell">{formatDate(statement.endDate)}</div>
                <div className="table-cell">{statement.type === StatementType.Checking ? 'Checking Account' : 'Credit Card'}</div>
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
    statements: getCreditCardStatements(state),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CreditCardStatementsTable);
