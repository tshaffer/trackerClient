import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Tabs, Tab, Box, Typography } from '@mui/material';

import { TrackerDispatch } from '../models';

import StatementsTable from './StatementsTable';

export interface StatementsContentPropsFromParent {
  activeTab: number;
}

interface StatementsContentProps extends StatementsContentPropsFromParent {
}

const StatementsContent: React.FC<StatementsContentProps> = (props: StatementsContentProps) => {
  const [tabIndex, setTabIndex] = React.useState(props.activeTab);

  React.useEffect(() => {
    setTabIndex(props.activeTab);
  }, [props.activeTab]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4">Statements</Typography>
      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab label="All" />
        <Tab label="Credit Card" />
      </Tabs>
      <Box sx={{ padding: '20px' }}>
        {tabIndex === 0 && (
          <Box>
            <StatementsTable />
          </Box>
        )}
        {tabIndex === 1 && (
          <Box>
            <StatementsTable />
          </Box>
        )}
      </Box>
    </Box>
  );
};

function mapStateToProps(state: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(StatementsContent);
