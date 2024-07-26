import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Checkbox, List, ListItem, ListItemText,
  ListItemSecondaryAction, Typography, Box
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
  const [masterChecked, setMasterChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);

  const handleToggle = (index: number) => () => {
    setChecked(prevState => {
      const newChecked = { ...prevState, [index]: !prevState[index] };
      updateMasterCheckbox(newChecked);
      return newChecked;
    });
  };

  const handleMasterToggle = () => {
    const newChecked = items.reduce((acc, _, index) => {
      acc[index] = !masterChecked;
      return acc;
    }, {} as { [key: number]: boolean });

    setChecked(newChecked);
    setMasterChecked(!masterChecked);
    setIndeterminate(false);
  };

  const updateMasterCheckbox = (newChecked: { [key: number]: boolean }) => {
    const totalItems = items.length;
    const checkedItems = Object.values(newChecked).filter(Boolean).length;

    setMasterChecked(checkedItems === totalItems);
    setIndeterminate(checkedItems > 0 && checkedItems < totalItems);
  };

  useEffect(() => {
    updateMasterCheckbox(checked);
  }, [checked, items]);

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