import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, DialogActions, DialogContent } from '@mui/material';
import { getAppInitialized } from '../selectors';

export interface AddCategoryDialogPropsFromParent {
  open: boolean;
  onAddCategory: (
    categoryLabel: string,
  ) => void;
  onClose: () => void;
}

export interface AddCategoryDialogProps extends AddCategoryDialogPropsFromParent {
  appInitialized: boolean;
}

const AddCategoryDialog = (props: AddCategoryDialogProps) => {

  const { open, onClose } = props;

  const [categoryLabel, setCategoryLabel] = React.useState('');
  const textFieldRef = useRef(null);

  React.useEffect(() => {
    console.log('React.useEffect props.open');
    console.log(open);
    console.log(textFieldRef.current);
    setCategoryLabel('');
  }, [props.open]);

  React.useEffect(() => {
    console.log('React.useEffect textFieldRef.current');
    console.log(open);
    console.log(textFieldRef.current);
    if (open && textFieldRef.current) {
      (textFieldRef.current as any).focus();
    }
  }, [textFieldRef]);

  // if (!props.appInitialized) {
  //   return null;
  // }
  useEffect(() => {
    console.log('React.useEffect setTimeout');
    console.log(open);
    console.log(textFieldRef.current);
    if (open) {
      setTimeout(() => {
        console.log('React.useEffect timeout');
        console.log(open);
        console.log(textFieldRef.current);
        if (open && textFieldRef.current) {
          (textFieldRef.current as any).focus();
        }  
      }, 1000);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleAddCategory = (): void => {
    if (categoryLabel !== '') {
      props.onAddCategory(categoryLabel);
      props.onClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleSetCategoryLabel = (categoryLabel: string): void => {
    setCategoryLabel(categoryLabel);
    console.log('handleSetCategoryLabel');
    console.log(open);
    console.log(textFieldRef.current);

  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Add Category</DialogTitle>
      <DialogContent style={{ paddingBottom: '0px' }}>
        <Box
          component="form"
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              style={{ paddingBottom: '8px' }}
              label="Category Label"
              value={categoryLabel}
              onChange={(event) => handleSetCategoryLabel(event.target.value)}
              inputRef={textFieldRef}
            />
          </div>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAddCategory} autoFocus>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

function mapStateToProps(state: any) {
  return {
    appInitialized: getAppInitialized(state),
  };
}

export default connect(mapStateToProps)(AddCategoryDialog);



