import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField, MenuItem, Select, InputLabel } from '@mui/material';

interface ReportsContentProps {
  activeTab: number;
}

const ReportsContent: React.FC<ReportsContentProps> = ({ activeTab }) => {
  const [tabIndex, setTabIndex] = React.useState(activeTab);
  const [dateOption, setDateOption] = useState<string>('all');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [selectedStatement, setSelectedStatement] = useState<string>('');

  React.useEffect(() => {
    setTabIndex(activeTab);
  }, [activeTab]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleDateOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateOption(event.target.value);
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  const handleStatementChange = (event: any) => {
    setSelectedStatement(event.target.value as string);
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
              <TextField
                label="Start Date"
                type="date"
                value={startDate || ''}
                onChange={handleStartDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={dateOption !== 'dateRange'}
              />
              <TextField
                label="End Date"
                type="date"
                value={endDate || ''}
                onChange={handleEndDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={dateOption !== 'dateRange'}
              />
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
          </Box>
        )}
        {tabIndex === 1 && <Typography>Assets Content</Typography>}
      </Box>
    </Box>
  );
};

export default ReportsContent;