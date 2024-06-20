import React, { useState } from 'react';
import { Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, MenuItem, Select, InputLabel, SelectChangeEvent } from '@mui/material';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TrackerDispatch, setEndDate, setExpenseReportDateRangeType, setStartDate } from '../models';
import { getStartDate, getEndDate, getExpenseReportDateRangeType } from '../selectors';
import { ExpenseReportDateRangeType } from '../types';
import dayjs, { Dayjs } from 'dayjs';
import { isNil } from 'lodash';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface DateRangeSpecifierProps {
  expenseReportDateRangeType: ExpenseReportDateRangeType;
  startDate: string,
  endDate: string,
  onSetExpenseReportDateRangeType: (dateRangeType: ExpenseReportDateRangeType) => any;
  onSetStartDate: (startDate: string) => any;
  onSetEndDate: (endDate: string) => any;
}

const DateRangeSpecifier: React.FC<DateRangeSpecifierProps> = (props: DateRangeSpecifierProps) => {
  const [selectedStatement, setSelectedStatement] = useState<string>('statement1');

  const handleDateOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onSetExpenseReportDateRangeType(event.target.value as ExpenseReportDateRangeType);
  };

  const handleSetStartDate = (dateDayJs: Dayjs | null) => {
    if (!isNil(dateDayJs)) {
      const date: Date = dateDayJs.toDate();
      props.onSetStartDate(date.toISOString());
    }
  };

  const handleSetEndDate = (dateDayJs: Dayjs | null) => {
    if (!isNil(dateDayJs)) {
      const date: Date = dateDayJs.toDate();
      props.onSetEndDate(date.toISOString());
    }
  };

  const handleStatementChange = (event: SelectChangeEvent<string>) => {
    setSelectedStatement(event.target.value as string);
  };

  const renderStartDate = (): JSX.Element => {
    return (
      <React.Fragment>
        <FormControl style={{ marginLeft: '6px', display: 'block' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                label="Start date"
                value={dayjs(props.startDate)}
                onChange={(newValue) => handleSetStartDate(newValue)}
                disabled={props.expenseReportDateRangeType !== ExpenseReportDateRangeType.DateRange}
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
                label="End date"
                value={dayjs(props.endDate)}
                onChange={(newValue) => handleSetEndDate(newValue)}
                disabled={props.expenseReportDateRangeType !== ExpenseReportDateRangeType.DateRange}
              />
            </DemoContainer>
          </LocalizationProvider>
        </FormControl>
      </React.Fragment>
    );
  };

  const renderStatementSelect = (): JSX.Element => {
    if (props.expenseReportDateRangeType !== ExpenseReportDateRangeType.Statement) {
      return <React.Fragment />;
    }
    return (
      <FormControl>
        <InputLabel id="statement-select-label">Name</InputLabel>
        <Select
          labelId="statement-select-label"
          id="statement-select"
          value={selectedStatement}
          onChange={handleStatementChange}
          label="Statement"
          disabled={props.expenseReportDateRangeType !== ExpenseReportDateRangeType.Statement}
        >
          <MenuItem value="statement1">Statement 1</MenuItem>
          <MenuItem value="statement2">Statement 2</MenuItem>
          <MenuItem value="statement3">Statement 3</MenuItem>
        </Select>
      </FormControl>
    );
  }
  return (
    <Box sx={{ width: '100%' }}>
      <FormControl component="fieldset">
        <RadioGroup row value={props.expenseReportDateRangeType} onChange={handleDateOptionChange}>
          <FormControlLabel value={ExpenseReportDateRangeType.All} control={<Radio />} label="All Dates" sx={{ maxHeight: '32px' }} />
          <FormControlLabel value={ExpenseReportDateRangeType.YearToDate} control={<Radio />} label="Year to Date" sx={{ maxHeight: '32px' }} />
          <FormControlLabel value={ExpenseReportDateRangeType.LastYear} control={<Radio />} label="Last Year" sx={{ maxHeight: '32px' }} />
          <FormControlLabel value={ExpenseReportDateRangeType.DateRange} control={<Radio />} label="Date Range" sx={{ maxHeight: '32px' }} />
          <FormControlLabel value={ExpenseReportDateRangeType.Statement} control={<Radio />} label="From Statement" sx={{ maxHeight: '32px' }} />
        </RadioGroup>
      </FormControl>
      {renderStatementSelect()}
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        {renderStartDate()}
        {renderEndDate()}
      </Box>
    </Box>
  );
};

function mapStateToProps(state: any) {
  return {
    expenseReportDateRangeType: getExpenseReportDateRangeType(state),
    startDate: getStartDate(state),
    endDate: getEndDate(state),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
    onSetExpenseReportDateRangeType: setExpenseReportDateRangeType,
    onSetStartDate: setStartDate,
    onSetEndDate: setEndDate,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(DateRangeSpecifier);
