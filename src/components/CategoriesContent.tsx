import React from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';

interface CategoriesContentProps {
  activeTab: number;
}

const CategoriesContent: React.FC<CategoriesContentProps> = ({ activeTab }) => {
  const [tabIndex, setTabIndex] = React.useState(activeTab);

  React.useEffect(() => {
    setTabIndex(activeTab);
  }, [activeTab]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4">Categories</Typography>
      <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Categories Tabs">
        <Tab label="List" />
        <Tab label="Add" />
        <Tab label="Edit" />
      </Tabs>
      <Box sx={{ padding: '20px' }}>
        {tabIndex === 0 && <Typography>List Content</Typography>}
        {tabIndex === 1 && <Typography>Add Content</Typography>}
        {tabIndex === 2 && <Typography>Edit Content</Typography>}
      </Box>
    </Box>
  );
};

export default CategoriesContent;
