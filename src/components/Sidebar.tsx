import React, { useState } from 'react';
import { Button, Popover, MenuItem, Box, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface SidebarProps {
  onButtonClick: (label: string, subLabel?: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onButtonClick }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleHover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (subLabel?: string) => {
    if (subLabel) {
      onButtonClick('Categories', subLabel);
    }
    setAnchorEl(null);
  };

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

      <Button
        fullWidth
        aria-haspopup="true"
        onMouseEnter={handleHover}
        onClick={() => handleClose('List')}
        endIcon={<ChevronRightIcon />}
      >
        Categories
      </Button>
      <Popover
        id="categories-popover"
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => handleClose()}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          onMouseLeave: () => handleClose(),
        }}
      >
        <MenuItem onClick={() => handleClose('List')}>List</MenuItem>
        <MenuItem onClick={() => handleClose('Add')}>Add</MenuItem>
        <MenuItem onClick={() => handleClose('Edit')}>Edit</MenuItem>
      </Popover>

      {/* Add other main buttons here in a similar way */}
    </Box>
  );
};

export default Sidebar;