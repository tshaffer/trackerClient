import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Checkbox, List, ListItem, ListItemText,
  Typography, Box
} from '@mui/material';

interface SimpleListDialogProps {
  open: boolean;
  onClose: () => void;
  items: { label: string }[];
  description?: string;
  spacing?: number;
}

const SimpleListDialog: React.FC<SimpleListDialogProps> = ({ open, onClose, items, description, spacing = 8 }) => {
  const [checked, setChecked] = useState<{ [key: number]: boolean }>({});

  const handleToggle = (index: number) => () => {
    setChecked(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  const handleMasterToggle = () => {
    const allChecked = areAllChecked();
    const newChecked = items.reduce((acc, _, index) => {
      acc[index] = !allChecked;
      return acc;
    }, {} as { [key: number]: boolean });

    setChecked(newChecked);
  };

  const areAllChecked = () => {
    return items.length > 0 && items.every((_, index) => checked[index]);
  };

  const areSomeChecked = () => {
    return items.some((_, index) => checked[index]) && !areAllChecked();
  };

  const masterChecked = areAllChecked();
  const indeterminate = areSomeChecked();

  const handleSave = () => {
    // Handle the save action, if needed
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Simple List</DialogTitle>
      <DialogContent>
        {description && (
          <Typography variant="body1" gutterBottom>
            {description}
          </Typography>
        )}
        <Box display="flex" alignItems="center" mb={2}>
          <Checkbox
            edge="start"
            indeterminate={indeterminate}
            checked={masterChecked}
            onChange={handleMasterToggle}
          />
          <Typography variant="body2">Select All</Typography>
        </Box>
        <List>
          {items.map((item, index) => (
            <ListItem key={index} button onClick={handleToggle(index)}>
              <Box display="flex" alignItems="center">
                <Checkbox
                  edge="start"
                  onChange={handleToggle(index)}
                  checked={checked[index] || false}
                />
                <Box ml={spacing}>
                  <ListItemText primary={item.label} />
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SimpleListDialog;