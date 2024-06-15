// src/components/Sidebar.tsx
import React from 'react';
import { Button, Box, Typography } from '@mui/material';

interface SidebarProps {
  onButtonClick: (label: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onButtonClick }) => {
  return (
    <Box
      sx={{
        width: '200px',
        height: '100vh',
        backgroundColor: '#f0f0f0',
        padding: '10px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h6" component="div" sx={{ marginBottom: '20px', marginTop: '10px' }}>
        Expense Tracker
      </Typography>
      <Button fullWidth onClick={() => onButtonClick('Categories')}>
        Categories
      </Button>
      <Button fullWidth onClick={() => onButtonClick('Keywords')}>
        Keywords
      </Button>
      <Button fullWidth onClick={() => onButtonClick('Statements')}>
        Statements
      </Button>
    </Box>
  );
};

export default Sidebar;
