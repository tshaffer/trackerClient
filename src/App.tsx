import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import CategoriesContent from './components/CategoriesContent';
import ReportsContent from './components/ReportsContent';
import { Box, Typography } from '@mui/material';
import './App.css';

const App: React.FC = () => {
  const [selectedMainButton, setSelectedMainButton] = useState<string | null>(null);
  const [selectedSubButton, setSelectedSubButton] = useState<string | null>('List');

  const handleButtonClick = (label: string, subLabel?: string) => {
    setSelectedMainButton(label);
    setSelectedSubButton(subLabel || 'List');
  };

  const renderContent = () => {
    if (selectedMainButton === 'Categories') {
      let activeTab = 0;
      if (selectedSubButton === 'List') activeTab = 0;
      else if (selectedSubButton === 'Add') activeTab = 1;
      else if (selectedSubButton === 'Edit') activeTab = 2;

      return <CategoriesContent activeTab={activeTab} />;
    } else if (selectedMainButton === 'Reports') {
      let activeTab = 0;
      if (selectedSubButton === 'Summary') activeTab = 0;
      else if (selectedSubButton === 'Detailed') activeTab = 1;

      return <ReportsContent activeTab={activeTab} />;
    }
    return <Typography variant="h4">Welcome</Typography>;
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar onButtonClick={handleButtonClick} />
      <Box sx={{ flexGrow: 1, padding: '20px' }}>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default App;