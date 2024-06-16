import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Button, Popper, MenuItem, Box, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface SidebarProps {
  onButtonClick: (label: string, subLabel?: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onButtonClick }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentMenu, setCurrentMenu] = useState<string | null>(null);

  const handleHover = (event: React.MouseEvent<HTMLButtonElement>, menu: string) => {
    setAnchorEl(event.currentTarget);
    setCurrentMenu(menu);
  };

  const handleClose = (subLabel?: string) => {
    if (subLabel) {
      onButtonClick(currentMenu!, subLabel);
    }
    setAnchorEl(null);
    setCurrentMenu(null);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
    setCurrentMenu(null);
  };

  const buttonStyle = {
    justifyContent: 'space-between',
    textTransform: 'none',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
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

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Menu</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Button
            sx={buttonStyle}
            aria-haspopup="true"
            onMouseEnter={(e) => handleHover(e, 'Categories')}
            onClick={() => handleClose('List')}
          >
            <span>Categories</span> <ChevronRightIcon />
          </Button>
          <Popper
            id="categories-Popper"
            open={Boolean(anchorEl) && currentMenu === 'Categories'}
            anchorEl={anchorEl}
            placement='right'
            // onClose={handleMouseLeave}
            // anchorOrigin={{
            //   vertical: 'top',
            //   horizontal: 'right',
            // }}
            // transformOrigin={{
            //   vertical: 'top',
            //   horizontal: 'left',
            // }}
            // PaperProps={{
            //   onMouseLeave: handleMouseLeave,
            // }}
          >
            <MenuItem onClick={() => handleClose('List')}>List</MenuItem>
            <MenuItem onClick={() => handleClose('Add')}>Add</MenuItem>
            <MenuItem onClick={() => handleClose('Edit')}>Edit</MenuItem>
          </Popper>

          <Button
            sx={buttonStyle}
            aria-haspopup="true"
            onMouseEnter={(e) => handleHover(e, 'Reports')}
            onClick={() => handleClose('Summary')}
          >
            <span>Reports</span> <ChevronRightIcon />
          </Button>
          <Popper
            id="reports-Popper"
            open={Boolean(anchorEl) && currentMenu === 'Reports'}
            anchorEl={anchorEl}
            placement='right'
            // onClose={handleMouseLeave}
            // anchorOrigin={{
            //   vertical: 'top',
            //   horizontal: 'right',
            // }}
            // transformOrigin={{
            //   vertical: 'top',
            //   horizontal: 'left',
            // }}
            // PaperProps={{
            //   onMouseLeave: handleMouseLeave,
            // }}
          >
            <MenuItem onClick={() => handleClose('Summary')}>Summary</MenuItem>
            <MenuItem onClick={() => handleClose('Detailed')}>Detailed</MenuItem>
          </Popper>
        </AccordionDetails>
      </Accordion>

      {/* Add other main buttons here in a similar way */}
    </Box>
  );
};

export default Sidebar;
