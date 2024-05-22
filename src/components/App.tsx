import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TrackerDispatch, setAppInitialized } from '../models';

export interface AppProps {
  onSetAppInitialized: () => any;
}

const App = (props: AppProps) => {

  return (
    <div>
      poo
    </div>

  );
};

function mapStateToProps(state: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
    onSetAppInitialized: setAppInitialized,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

