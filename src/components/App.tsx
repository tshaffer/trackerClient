import React, { useState } from 'react';
import Sidebar from './Sidebar';
import CategoriesContent from './CategoriesContent';
import { Box, Typography } from '@mui/material';
import './App.css';

const App: React.FC = () => {
  const [selectedMainButton, setSelectedMainButton] = useState<string | null>(null);
  const [selectedSubButton, setSelectedSubButton] = useState<string | null>(null);

  const handleButtonClick = (label: string, subLabel?: string) => {
    setSelectedMainButton(label);
    setSelectedSubButton(subLabel || null);
  };

  const renderContent = () => {
    if (selectedMainButton === 'Categories') {
      let activeTab = 0;
      if (selectedSubButton === 'List') activeTab = 0;
      else if (selectedSubButton === 'Add') activeTab = 1;
      else if (selectedSubButton === 'Edit') activeTab = 2;

      return <CategoriesContent activeTab={activeTab} />;
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
