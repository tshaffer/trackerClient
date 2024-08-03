import React, {  } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Button, DialogActions, DialogContent } from '@mui/material';

import { TrackerDispatch } from '../models';
import SelectCategory from './SelectCategory';

export interface OverrideTransactionCategoriesDialogPropsFromParent {
  open: boolean;
  onSave: (categoryId: string) => void;
  onClose: () => void;
}

export interface OverrideTransactionCategoriesDialogProps extends OverrideTransactionCategoriesDialogPropsFromParent {
}

const OverrideTransactionCategoriesDialog = (props: OverrideTransactionCategoriesDialogProps) => {

  const { open, onSave, onClose } = props;

  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>('');

  if (!open) {
    return null;
  }

  function handleSave(event: any): void {
    onSave(selectedCategoryId);
    onClose();
  }

  function handleCategoryChange(categoryId: string): void {
    setSelectedCategoryId(categoryId)
  }
  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Select Category</DialogTitle>
        <DialogContent style={{ paddingBottom: '0px' }}>
          <div>
            <SelectCategory
              selectedCategoryId={selectedCategoryId}
              onSetCategoryId={handleCategoryChange}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} autoFocus variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

function mapStateToProps(state: any, ownProps: OverrideTransactionCategoriesDialogPropsFromParent) {
  return {
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(OverrideTransactionCategoriesDialog);
