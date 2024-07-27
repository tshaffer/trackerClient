import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TrackerDispatch } from '../models';

interface CreditCardStatementProps {
}

const CreditCardStatement: React.FC<CreditCardStatementProps> = (props: CreditCardStatementProps) => {
  return (
    <div>pizza</div>
  );
}

function mapStateToProps(state: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CreditCardStatement);
