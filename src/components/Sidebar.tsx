import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Button, Box, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface SidebarProps {
  onButtonClick: (label: string, subLabel?: string) => void;
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
      }}
    >
      <Typography variant="h5" component="div" sx={{ marginBottom: '20px', textAlign: 'center' }}>
        Expense Tracker
      </Typography>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Categories</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Button fullWidth onClick={() => onButtonClick('Categories')}>Categories</Button>
          <Button fullWidth onClick={() => onButtonClick('Categories', 'List')}>List</Button>
          <Button fullWidth onClick={() => onButtonClick('Categories', 'Add')}>Add</Button>
          <Button fullWidth onClick={() => onButtonClick('Categories', 'Edit')}>Edit</Button>
        </AccordionDetails>
      </Accordion>

      {/* Add other main buttons here in a similar way */}
    </Box>
  );
};

export default Sidebar;
