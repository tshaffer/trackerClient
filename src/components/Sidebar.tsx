import React, { useState } from 'react';
import { Button, Menu, MenuItem, Box, Typography } from '@mui/material';
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
    onButtonClick('Categories', subLabel);
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
        aria-controls="categories-menu"
        aria-haspopup="true"
        onMouseEnter={handleHover}
        onClick={() => handleClose('List')}
        endIcon={<ChevronRightIcon />}
      >
        Categories
      </Button>
      <Menu
        id="categories-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => handleClose()}
        MenuListProps={{ onMouseLeave: () => handleClose() }}
      >
        <MenuItem onClick={() => handleClose('List')}>List</MenuItem>
        <MenuItem onClick={() => handleClose('Add')}>Add</MenuItem>
        <MenuItem onClick={() => handleClose('Edit')}>Edit</MenuItem>
      </Menu>

      {/* Add other main buttons here in a similar way */}
    </Box>
  );
};

export default Sidebar;
