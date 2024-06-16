import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, MenuItem, Select, InputLabel, SelectChangeEvent, Button } from '@mui/material';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TrackerDispatch } from '../models';
import { getStartDate, getEndDate, getTransactionsByCategory, getUnidentifiedBankTransactions } from '../selectors';
import { StringToTransactionsLUT, BankTransactionEntity } from '../types';
import dayjs, { Dayjs } from 'dayjs';
import { isNil } from 'lodash';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface ReportsContentProps {
  activeTab: number;
  transactionsByCategory: StringToTransactionsLUT,
  unidentifiedTransactions: BankTransactionEntity[],
  startDate: string,
  endDate: string,
}

const ReportsContent: React.FC<ReportsContentProps> = (props: ReportsContentProps) => {
  const [tabIndex, setTabIndex] = React.useState(props.activeTab);
  const [dateOption, setDateOption] = useState<string>('all');
  const [selectedStatement, setSelectedStatement] = useState<string>('');
  const [startDate, setStartDate] = React.useState("2023-01-01");
  const [endDate, setEndDate] = React.useState("2023-12-31");

  React.useEffect(() => {
    setTabIndex(props.activeTab);
  }, [props.activeTab]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleDateOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateOption(event.target.value);
  };

  const handleSetStartDate = (dateDayJs: Dayjs | null) => {
    if (!isNil(dateDayJs)) {
      const date: Date = dateDayJs.toDate();
      setStartDate(date.toISOString());
    }
  };

  const handleSetEndDate = (dateDayJs: Dayjs | null) => {
    if (!isNil(dateDayJs)) {
      const date: Date = dateDayJs.toDate();
      setEndDate(date.toISOString());
    }
  };

  const handleStatementChange = (event: SelectChangeEvent<string>) => {
    setSelectedStatement(event.target.value as string);
  };

  const handleGenerateReport = () => {
    console.log('Generating report with the following settings:');
    console.log('Date Option:', dateOption);
    if (dateOption === 'dateRange') {
      console.log('Start Date:', props.startDate);
      console.log('End Date:', props.endDate);
    }
    if (dateOption === 'statement') {
      console.log('Selected Statement:', selectedStatement);
    }
  };

  const renderStartDate = (): JSX.Element => {
    return (
      <React.Fragment>
        <FormControl style={{ marginLeft: '6px', display: 'block' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                label="Date"
                value={dayjs(startDate)}
                onChange={(newValue) => handleSetStartDate(newValue)}
                disabled={dateOption !== 'dateRange'}
              />
            </DemoContainer>
          </LocalizationProvider>
        </FormControl>
      </React.Fragment>
    );
  };

  const renderEndDate = (): JSX.Element => {
    return (
      <React.Fragment>
        <FormControl style={{ marginLeft: '6px', display: 'block' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                label="Date"
                value={dayjs(endDate)}
                onChange={(newValue) => handleSetEndDate(newValue)}
                disabled={dateOption !== 'dateRange'}
              />
            </DemoContainer>
          </LocalizationProvider>
        </FormControl>
      </React.Fragment>
    );
  };
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4">Reports</Typography>
      <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Reports Tabs">
        <Tab label="Expenses" />
        <Tab label="Assets" />
      </Tabs>
      <Box sx={{ padding: '20px' }}>
        {tabIndex === 0 && (
          <Box>
            <FormControl component="fieldset">
              <FormLabel component="legend">Specify Date Range</FormLabel>
              <RadioGroup value={dateOption} onChange={handleDateOptionChange}>
                <FormControlLabel value="all" control={<Radio />} label="All Dates" sx={{ maxHeight: '32px' }} />
                <FormControlLabel value="ytd" control={<Radio />} label="Year to Date" sx={{ maxHeight: '32px' }} />
                <FormControlLabel value="lastYear" control={<Radio />} label="Last Year" sx={{ maxHeight: '32px' }} />
                <FormControlLabel value="dateRange" control={<Radio />} label="Date Range" sx={{ maxHeight: '32px' }} />
              </RadioGroup>
            </FormControl>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <React.Fragment>
                {renderStartDate()}
                {renderEndDate()}
              </React.Fragment>
            </Box>
            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <RadioGroup value={dateOption} onChange={handleDateOptionChange}>
                <FormControlLabel value="statement" control={<Radio />} label="From Statement" sx={{ maxHeight: '32px' }} />
              </RadioGroup>
              <FormControl fullWidth disabled={dateOption !== 'statement'} sx={{ mt: 2 }}>
                <InputLabel id="statement-select-label">Statement</InputLabel>
                <Select
                  labelId="statement-select-label"
                  id="statement-select"
                  value={selectedStatement}
                  onChange={handleStatementChange}
                  label="Statement"
                >
                  <MenuItem value="statement1">Statement 1</MenuItem>
                  <MenuItem value="statement2">Statement 2</MenuItem>
                  <MenuItem value="statement3">Statement 3</MenuItem>
                </Select>
              </FormControl>
            </FormControl>
            <Box sx={{ mt: 3 }}>
              <Button variant="contained" color="primary" onClick={handleGenerateReport}>
                Generate Expenses Report
              </Button>
            </Box>
          </Box>
        )}
        {tabIndex === 1 && <Typography>Assets Content</Typography>}
      </Box>
    </Box>
  );
};

function mapStateToProps(state: any) {
  return {
    startDate: getStartDate(state),
    endDate: getEndDate(state),
    transactionsByCategory: getTransactionsByCategory(state),
    unidentifiedTransactions: getUnidentifiedBankTransactions(state),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportsContent);
