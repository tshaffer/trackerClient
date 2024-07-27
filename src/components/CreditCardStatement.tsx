import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { TrackerDispatch } from '../models';

const CreditCardStatement = () => {
  return (
    <div>
      <h1>Credit Card Statement</h1>
    </div>
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
