import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Button, Popper, MenuItem, Box, Typography, Paper, ClickAwayListener, MenuList } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { SidebarMenuButton } from '../types';

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

  const handleClickAway = () => {
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
        width: '280px',
        minWidth: '280px',
        height: '100vh',
        backgroundColor: '#f0f0f0',
        padding: '10px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >

      <Accordion defaultExpanded>
        <AccordionSummary
          style={{ 
            minHeight: '0px', 
            maxHeight: '22px', 
            marginTop: '14px',
          }}
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography>Menu</Typography>
        </AccordionSummary>
        <AccordionDetails>

          <Button
            sx={buttonStyle}
            aria-haspopup="true"
            onMouseEnter={(e) => handleHover(e, SidebarMenuButton.Reports)}
            onClick={() => handleClose('Spending')}
          >
            <span>{SidebarMenuButton.Reports}</span><ChevronRightIcon />
          </Button>
          <Popper
            id="reports-popper"
            open={Boolean(anchorEl) && currentMenu === SidebarMenuButton.Reports}
            anchorEl={anchorEl}
            placement="right-start"
            disablePortal={false}
            modifiers={[
              {
                name: 'offset',
                options: {
                  offset: [0, 0],
                },
              },
            ]}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClickAway}>
                <MenuList>
                  <MenuItem onClick={() => handleClose('Spending')}>Spending</MenuItem>
                  <MenuItem onClick={() => handleClose('Unidentified Transactions')}>Unidentified Transactions</MenuItem>
                  <MenuItem onClick={() => handleClose('Fixed Expenses')}>Fixed Expenses</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Popper>

          <Button
            sx={buttonStyle}
            aria-haspopup="true"
            onMouseEnter={(e) => handleHover(e, SidebarMenuButton.Categories)}
            onClick={() => handleClose('List')}
          >
            <span>{SidebarMenuButton.Categories}</span><ChevronRightIcon />
          </Button>

          <Button
            sx={buttonStyle}
            aria-haspopup="true"
            onMouseEnter={(e) => handleHover(e, SidebarMenuButton.CategoryAssignmentRules)}
            onClick={() => handleClose('List')}
          >
            <span>{SidebarMenuButton.CategoryAssignmentRules}</span><ChevronRightIcon />
          </Button>

          <Button
            sx={buttonStyle}
            aria-haspopup="true"
            onMouseEnter={(e) => handleHover(e, SidebarMenuButton.Statements)}
            onClick={() => handleClose(SidebarMenuButton.Statements)}
          >
            <span>{SidebarMenuButton.Statements}</span><ChevronRightIcon />
          </Button>
          <Popper
            id="reports-popper"
            open={Boolean(anchorEl) && currentMenu === SidebarMenuButton.Statements}
            anchorEl={anchorEl}
            placement="right-start"
            disablePortal={false}
            modifiers={[
              {
                name: 'offset',
                options: {
                  offset: [0, 0],
                },
              },
            ]}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClickAway}>
                <MenuList>
                  <MenuItem onClick={() => handleClose('Credit Card')}>Credit Card</MenuItem>
                  <MenuItem onClick={() => handleClose('Checking Account')}>Checking Account</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Popper>

        </AccordionDetails>
      </Accordion>

    </Box>
  );
};

export default Sidebar;