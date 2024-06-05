import * as React from 'react';
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

  // if (!props.appInitialized) {
  //   return null;
  // }

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
              onChange={(event) => setCategoryLabel(event.target.value)}
            />
          </div>
        </Box>
      </DialogContent>
      <DialogActions
      >
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



