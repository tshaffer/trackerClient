// src/components/MainContent.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';

interface MainContentProps {
  content: string;
}

const MainContent: React.FC<MainContentProps> = ({ content }) => {
  return (
    <Box sx={{ padding: '20px', flexGrow: 1 }}>
      <Typography variant="h4">{content}</Typography>
    </Box>
  );
};

export default MainContent;
