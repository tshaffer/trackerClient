// src/App.tsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import { Box } from '@mui/material';
import './App.css';

const App: React.FC = () => {
  const [content, setContent] = useState('Welcome');

  const handleButtonClick = (label: string) => {
    setContent(label);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar onButtonClick={handleButtonClick} />
      <MainContent content={content} />
    </Box>
  );
};

export default App;
