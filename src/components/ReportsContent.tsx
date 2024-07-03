import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Tabs, Tab, Box, Typography, Button } from '@mui/material';

import { TrackerDispatch, setGeneratedReportEndDate, setGeneratedReportStartDate } from '../models';
import { getStartDate, getEndDate, getDateRangeType, getReportStatement, getReportStatementId } from '../selectors';
import { search } from '../controllers';

import DateRangeSpecifier from './DateRangeSpecifier';
import SpendingReportTable from './SpendingReportTable';
import UnIdentifiedTransactionTable from './UnidentifiedTransactionTable';
import { DateRangeType, SidebarMenuButton, Statement, StatementType } from '../types';
import { isNil } from 'lodash';

export interface ReportsContentPropsFromParent {
  activeTab: number;
}

interface ReportsContentProps extends ReportsContentPropsFromParent {
  startDate: string,
  endDate: string,
  dateRangeType: DateRangeType,
  reportStatement: Statement | null,
  onSearch: (startDate: string, endDate: string, includeCreditCardTransactions: boolean, includeCheckingAccountTransactions: boolean) => any;
  onSetGeneratedReportStartDate: (date: string) => any;
  onSetGeneratedReportEndDate: (date: string) => any;
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

    props.onSetGeneratedReportStartDate(props.startDate);
    props.onSetGeneratedReportEndDate(props.endDate);

    let includeCreditCardTransactions = true;
    let includeCheckingAccountTransactions = true;
    if (props.dateRangeType === DateRangeType.Statement) {
      if (!isNil(props.reportStatement)) {
        includeCreditCardTransactions = props.reportStatement.type === StatementType.CreditCard;
        includeCheckingAccountTransactions = props.reportStatement.type === StatementType.Checking;
      }
    }

    props.onSearch(props.startDate, props.endDate, includeCreditCardTransactions, includeCheckingAccountTransactions);
  };

  const handleGenerateUnidentifiedTransactionsGenerateReport = () => {

    props.onSetGeneratedReportStartDate(props.startDate);
    props.onSetGeneratedReportEndDate(props.endDate);

    let includeCreditCardTransactions = true;
    let includeCheckingAccountTransactions = true;
    if (props.dateRangeType === DateRangeType.Statement) {
      if (!isNil(props.reportStatement)) {
        includeCreditCardTransactions = props.reportStatement.type === StatementType.CreditCard;
        includeCheckingAccountTransactions = props.reportStatement.type === StatementType.Checking;
      }
    }

    props.onSearch(props.startDate, props.endDate, includeCreditCardTransactions, includeCheckingAccountTransactions);
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5">{SidebarMenuButton.Reports}</Typography>
      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab label="Spending" />
        <Tab label="Unidentified Transactions" />
      </Tabs>
      <Box sx={{ padding: '20px' }}>
        {tabIndex === 0 && (
          <Box>
            <DateRangeSpecifier />
            <Box sx={{ mt: 3 }}>
              <Button variant="contained" color="primary" onClick={handleGenerateReport}>
                Generate Report
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
                Generate  Report
              </Button>
            </Box>
            <Box>
              <UnIdentifiedTransactionTable />
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
    dateRangeType: getDateRangeType(state),
    reportStatement: getReportStatement(state, getReportStatementId(state)),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
    onSearch: search,
    onSetGeneratedReportStartDate: setGeneratedReportStartDate,
    onSetGeneratedReportEndDate: setGeneratedReportEndDate,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportsContent);
