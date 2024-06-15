import React from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';

interface ReportsContentProps {
  activeTab: number;
}

const ReportsContent: React.FC<ReportsContentProps> = ({ activeTab }) => {
  const [tabIndex, setTabIndex] = React.useState(activeTab);

  React.useEffect(() => {
    setTabIndex(activeTab);
  }, [activeTab]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4">Reports</Typography>
      <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Reports Tabs">
        <Tab label="Summary" />
        <Tab label="Detailed" />
      </Tabs>
      <Box sx={{ padding: '20px' }}>
        {tabIndex === 0 && <Typography>Summary Content</Typography>}
        {tabIndex === 1 && <Typography>Detailed Content</Typography>}
      </Box>
    </Box>
  );
};

export default ReportsContent;