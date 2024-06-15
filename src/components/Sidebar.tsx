import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Button, Popover, MenuItem, Box, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { isNil } from 'lodash';

interface SidebarProps {
  onButtonClick: (label: string, subLabel?: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onButtonClick }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentMenu, setCurrentMenu] = useState<string | null>(null);

  const handleHover = (event: React.MouseEvent<HTMLButtonElement>, menu: string) => {
    console.log('hover');
    return;
    setAnchorEl(event.currentTarget);
    setCurrentMenu(menu);
  };

  const handleClose = (subLabel?: string) => {
    console.log('close');
    // return;
    if (subLabel) {
      onButtonClick(currentMenu!, subLabel);
    }
    setAnchorEl(null);
    setCurrentMenu(null);
  };

  const handlePopoverEnter = () => {
    console.log('enter');
    return;
    // Prevent closing the popover when moving from button to popover
    // setAnchorEl(anchorEl);
  };

  const handlePopoverLeave = () => {
    console.log('leave');
    return;
    // setAnchorEl(null);
    // setCurrentMenu(null);
  };

  const handleButtonMouseLeave = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log('button leave');
    return;
    // if (!isNil(anchorEl)) {
    //   if (!anchorEl.contains(event.relatedTarget as Node)) {
    //     setAnchorEl(null);
    //     setCurrentMenu(null);
    //   }
    // }
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
            onMouseLeave={handleButtonMouseLeave}
            onClick={() => handleClose('List')}
          >
            <span>Categories</span> <ChevronRightIcon />
          </Button>
          <Popover
            id="categories-popover"
            open={Boolean(anchorEl) && currentMenu === 'Categories'}
            anchorEl={anchorEl}
            onClose={handlePopoverLeave}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            PaperProps={{
              onMouseEnter: handlePopoverEnter,
              onMouseLeave: handlePopoverLeave,
            }}
          >
            <MenuItem onClick={() => handleClose('List')}>List</MenuItem>
            <MenuItem onClick={() => handleClose('Add')}>Add</MenuItem>
            <MenuItem onClick={() => handleClose('Edit')}>Edit</MenuItem>
          </Popover>

          <Button
            sx={buttonStyle}
            aria-haspopup="true"
            onMouseEnter={(e) => handleHover(e, 'Reports')}
            onMouseLeave={handleButtonMouseLeave}
            onClick={() => handleClose('Summary')}
          >
            <span>Reports</span> <ChevronRightIcon />
          </Button>
          <Popover
            id="reports-popover"
            open={Boolean(anchorEl) && currentMenu === 'Reports'}
            anchorEl={anchorEl}
            onClose={handlePopoverLeave}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            PaperProps={{
              onMouseEnter: handlePopoverEnter,
              onMouseLeave: handlePopoverLeave,
            }}
          >
            <MenuItem onClick={() => handleClose('Summary')}>Summary</MenuItem>
            <MenuItem onClick={() => handleClose('Detailed')}>Detailed</MenuItem>
          </Popover>
        </AccordionDetails>
      </Accordion>

      {/* Add other main buttons here in a similar way */}
    </Box>
  );
};

export default Sidebar;