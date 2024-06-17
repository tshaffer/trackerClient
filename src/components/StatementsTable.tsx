import React from 'react';

import '../styles/Tracker.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isEmpty } from 'lodash';

import { StatementEntity } from '../types';
import { TrackerDispatch } from '../models';
import { getStatements } from '../selectors';

interface StatementsTableProps {
  statements: StatementEntity[];
}

const StatementsTable: React.FC<StatementsTableProps> = (props: StatementsTableProps) => {
  
  if (isEmpty(props.statements)) {
    return null;
  }

  return (
    <React.Fragment>
      <div className="table-container">
      <div className="table-header">
        <div className="table-row">
          <div className="table-cell">Start Date</div>
          <div className="table-cell">End Date</div>
        </div>
      </div>
      <div className="table-body">
        {props.statements.map((statement: StatementEntity) => (
          <React.Fragment key={statement.id}>
            <div className="table-row">
              <div className="table-cell">{statement.startDate}</div>
              <div className="table-cell">{statement.endDate}</div>
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
    statements: getStatements(state),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(StatementsTable);
