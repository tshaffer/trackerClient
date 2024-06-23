import React, { useState } from 'react';
import { Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, MenuItem, Select, InputLabel, SelectChangeEvent } from '@mui/material';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TrackerDispatch, setEndDate, setDateRangeType, setStartDate } from '../models';
import { getStartDate, getEndDate, getDateRangeType, getMinMaxTransactionDates } from '../selectors';
import { DateRangeType, MinMaxDates } from '../types';
import dayjs, { Dayjs } from 'dayjs';
import { isNil } from 'lodash';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface DateRangeSpecifierProps {
  dateRangeType: DateRangeType;
  startDate: string,
  endDate: string,
  minMaxTransactionDates: MinMaxDates,
  onSetDateRangeType: (dateRangeType: DateRangeType) => any;
  onSetStartDate: (startDate: string) => any;
  onSetEndDate: (endDate: string) => any;
}

const DateRangeSpecifier: React.FC<DateRangeSpecifierProps> = (props: DateRangeSpecifierProps) => {
  const [selectedStatement, setSelectedStatement] = useState<string>('statement1');

  const getISODateString = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const getFirstDayOfCurrentYear = (): string => {
    const now = new Date();
    const firstDayOfCurrentYear = new Date(now.getFullYear(), 0, 1);
    return getISODateString(firstDayOfCurrentYear);
  };

  const getCurrentDate = (): string => {
    const now = new Date();
    return getISODateString(now);
  };

  const getFirstDayOfLastYear = (): string => {
    const now = new Date();
    const firstDayOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
    return getISODateString(firstDayOfLastYear);
  };

  const getLastDayOfLastYear = (): string => {
    const now = new Date();
    const lastDayOfLastYear = new Date(now.getFullYear() - 1, 11, 31);
    return getISODateString(lastDayOfLastYear);
  };

  const getStartDate = (dateRangeType: DateRangeType): string => {
    switch (dateRangeType) {
      case DateRangeType.All:
        return props.minMaxTransactionDates.minDate;
      case DateRangeType.YearToDate:
        return getFirstDayOfCurrentYear();
      case DateRangeType.LastYear:
        return getFirstDayOfLastYear();
      default:
        return props.startDate;
    }
  }

  const getEndDate = (dateRangeType: DateRangeType): string => {
    switch (dateRangeType) {
      case DateRangeType.All:
        return props.minMaxTransactionDates.maxDate;
      case DateRangeType.YearToDate:
        return getCurrentDate();
      case DateRangeType.LastYear:
        return getLastDayOfLastYear();
      default:
        return props.endDate;
    }
  }

  const handleDateOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDateRangeType = event.target.value as DateRangeType;
    props.onSetDateRangeType(newDateRangeType);
    const newStartDate = getStartDate(newDateRangeType);
    const newEndDate = getEndDate(newDateRangeType);
    props.onSetStartDate(newStartDate);
    props.onSetEndDate(newEndDate);
  }

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
                disabled={props.dateRangeType !== DateRangeType.DateRange}
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
                disabled={props.dateRangeType !== DateRangeType.DateRange}
              />
            </DemoContainer>
          </LocalizationProvider>
        </FormControl>
      </React.Fragment>
    );
  };

  const renderStatementSelect = (): JSX.Element => {
    if (props.dateRangeType !== DateRangeType.Statement) {
      return <React.Fragment />;
    }
    return (
      <FormControl sx={{ ml: 2, minWidth: 120 }}>
        <InputLabel id="statement-select-label">Name</InputLabel>
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

    );
  }
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControl component="fieldset">
          <RadioGroup row value={props.dateRangeType} onChange={handleDateOptionChange}>
            <FormControlLabel value={DateRangeType.All} control={<Radio />} label="All Dates" sx={{ maxHeight: '32px' }} />
            <FormControlLabel value={DateRangeType.YearToDate} control={<Radio />} label="Year to Date" sx={{ maxHeight: '32px' }} />
            <FormControlLabel value={DateRangeType.LastYear} control={<Radio />} label="Last Year" sx={{ maxHeight: '32px' }} />
            <FormControlLabel value={DateRangeType.DateRange} control={<Radio />} label="Date Range" sx={{ maxHeight: '32px' }} />
            <FormControlLabel value={DateRangeType.Statement} control={<Radio />} label="From Statement" sx={{ maxHeight: '32px' }} />
          </RadioGroup>
        </FormControl>
        {renderStatementSelect()}
      </Box>
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        {renderStartDate()}
        {renderEndDate()}
      </Box>
    </Box>
  );
};

function mapStateToProps(state: any) {
  return {
    dateRangeType: getDateRangeType(state),
    startDate: getStartDate(state),
    endDate: getEndDate(state),
    minMaxTransactionDates: getMinMaxTransactionDates(state),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
    onSetDateRangeType: setDateRangeType,
    onSetStartDate: setStartDate,
    onSetEndDate: setEndDate,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(DateRangeSpecifier);
