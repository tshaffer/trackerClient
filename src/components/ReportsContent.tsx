import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Tabs, Tab, Box, Typography, Button } from '@mui/material';

import { TrackerDispatch } from '../models';
import { getStartDate, getEndDate } from '../selectors';
import { search } from '../controllers';

import DateRangeSpecifier from './DateRangeSpecifier';
import SpendingReportTable from './SpendingReportTable';
import NotIdentifiedTransactionTable from './NotIdentifiedTransactionTable';

export interface ReportsContentPropsFromParent {
  activeTab: number;
}

interface ReportsContentProps extends ReportsContentPropsFromParent {
  startDate: string,
  endDate: string,
  onSearch: (startDate: string, endDate: string) => any;
}

const ReportsContent: React.FC<ReportsContentProps> = (props: ReportsContentProps) => {
  const [tabIndex, setTabIndex] = React.useState(props.activeTab);

  React.useEffect(() => {
    setTabIndex(props.activeTab);
  }, [props.activeTab]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleGenerateReport = () => {
    props.onSearch(props.startDate, props.endDate);
  };

  const handleGenerateUnidentifiedTransactionsGenerateReport = () => {
    props.onSearch(props.startDate, props.endDate);
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5">Reports</Typography>
      <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Reports Tabs">
        <Tab label="Spending" />
        <Tab label="Unidentified Transactions" />
      </Tabs>
      <Box sx={{ padding: '20px' }}>
        {tabIndex === 0 && (
          <Box>
            <DateRangeSpecifier />
            <Box sx={{ mt: 3 }}>
              <Button variant="contained" color="primary" onClick={handleGenerateReport}>
                Generate Expenses Report
              </Button>
            </Box>
            <Box>
              <SpendingReportTable />
            </Box>
          </Box>
        )}
        {tabIndex === 1 && (
          <Box>
            <DateRangeSpecifier />
            <Box sx={{ mt: 3 }}>
              <Button variant="contained" color="primary" onClick={handleGenerateUnidentifiedTransactionsGenerateReport}>
                Generate Unidentified Transactions Report
              </Button>
            </Box>
            <Box>
              <NotIdentifiedTransactionTable />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

function mapStateToProps(state: any) {
  return {
    startDate: getStartDate(state),
    endDate: getEndDate(state),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
    onSearch: search,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportsContent);
