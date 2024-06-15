import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Button, Popover, MenuItem, Box, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface SidebarProps {
  onButtonClick: (label: string, subLabel?: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onButtonClick }) => {
  const [anchorElCategories, setAnchorElCategories] = useState<null | HTMLElement>(null);
  const [anchorElReports, setAnchorElReports] = useState<null | HTMLElement>(null);

  const handleHoverCategories = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElCategories(event.currentTarget);
  };

  const handleHoverReports = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElReports(event.currentTarget);
  };

  const handleCloseCategories = (subLabel?: string) => {
    if (subLabel) {
      onButtonClick('Categories', subLabel);
    }
    setAnchorElCategories(null);
  };

  const handleCloseReports = (subLabel?: string) => {
    if (subLabel) {
      onButtonClick('Reports', subLabel);
    }
    setAnchorElReports(null);
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
            onMouseEnter={handleHoverCategories}
            onClick={() => handleCloseCategories('List')}
          >
            <span>Categories</span> <ChevronRightIcon />
          </Button>
          <Popover
            id="categories-popover"
            open={Boolean(anchorElCategories)}
            anchorEl={anchorElCategories}
            onClose={() => handleCloseCategories()}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            PaperProps={{
              onMouseLeave: () => handleCloseCategories(),
            }}
          >
            <MenuItem onClick={() => handleCloseCategories('List')}>List</MenuItem>
            <MenuItem onClick={() => handleCloseCategories('Add')}>Add</MenuItem>
            <MenuItem onClick={() => handleCloseCategories('Edit')}>Edit</MenuItem>
          </Popover>

          <Button
            sx={buttonStyle}
            aria-haspopup="true"
            onMouseEnter={handleHoverReports}
            onClick={() => handleCloseReports('Summary')}
          >
            <span>Reports</span> <ChevronRightIcon />
          </Button>
          <Popover
            id="reports-popover"
            open={Boolean(anchorElReports)}
            anchorEl={anchorElReports}
            onClose={() => handleCloseReports()}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            PaperProps={{
              onMouseLeave: () => handleCloseReports(),
            }}
          >
            <MenuItem onClick={() => handleCloseReports('Summary')}>Summary</MenuItem>
            <MenuItem onClick={() => handleCloseReports('Detailed')}>Detailed</MenuItem>
          </Popover>
        </AccordionDetails>
      </Accordion>

      {/* Add other main buttons here in a similar way */}
    </Box>
  );
};

export default Sidebar;