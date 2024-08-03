import React, { ChangeEvent, useState } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { Category, Transaction } from '../types';
import { TrackerDispatch } from '../models';
import { getCategoryByTransactionId, getTransactionById } from '../selectors';
import { formatCurrency, formatDate } from '../utilities';
import { addCategory } from '../controllers';
import SelectCategory from './SelectCategory';
import EditTransactionMoreOptionsDialog from './EditTransactionMoreOptionsDialog';

export interface EditTransactionDialogPropsFromParent {
  open: boolean;
  transactionId: string;
  onClose: () => void;
  onSave: (updatedTransaction: Transaction) => void;
}

interface EditTransactionDialogProps extends EditTransactionDialogPropsFromParent {
  transaction: Transaction;
  inferredCategory: Category | null | undefined;
  onAddCategory: (category: Category) => any;
}

const EditTransactionDialog = (props: EditTransactionDialogProps) => {

  if (!props.open) {
    return null;
  }

  const [userDescription, setUserDescription] = useState(props.transaction.userDescription);
  const [overrideCategory, setOverrideCategory] = React.useState(props.transaction.overrideCategory);
  const [overrideCategoryId, setOverrideCategoryId] = React.useState(props.transaction.overrideCategoryId);
  // const [overrideTransactionsRequired, setOverrideTransactionsRequired] = React.useState(props.transaction.overrideTransactionsRequired);
  // const [overriddenTransactionRequired, setOverriddenTransactionRequired] = React.useState(props.transaction.overriddenTransactionRequired);
  const [showEditTransactionMoreOptionsDialog, setShowEditTransactionMoreOptionsDialog] = React.useState(false);

  const handleEditTransactionMoreOptions = () => {
    setShowEditTransactionMoreOptionsDialog(true);
  };

  const handleSaveTransactionMoreOptions = (transaction: Transaction) => {
    console.log('handleSaveTransactionMoreOptions');
    console.log(transaction);
    // props.onUpdateTransaction(transaction);
  };

  const handleCloseEditTransactionMoreOptionsDialog = () => {
    setShowEditTransactionMoreOptionsDialog(false);
  }

  const handleSave = () => {
    const updatedTransaction: Transaction = {
      ...props.transaction,
      userDescription,
      overrideCategory,
      overrideCategoryId,
      // overrideTransactionsRequired,
      // overriddenTransactionRequired,
    };
    props.onSave(updatedTransaction);
    props.onClose();
  };

  function handleSetOverrideCategory(event: ChangeEvent<HTMLInputElement>, checked: boolean): void {
    setOverrideCategory(event.target.checked);
  }

  function handleSetOverrideCategoryId(categoryId: string): void {
    setOverrideCategoryId(categoryId);
  }

  // function handleSetOverrideTransactionsRequired(event: ChangeEvent<HTMLInputElement>, checked: boolean): void {
  //   setOverrideTransactionsRequired(event.target.checked);
  // }

  // function handleSetOverriddenTransactionRequired(event: ChangeEvent<HTMLInputElement>, checked: boolean): void {
  //   setOverriddenTransactionRequired(event.target.checked);
  // }

  return (
    <React.Fragment>
      <EditTransactionMoreOptionsDialog
        open={showEditTransactionMoreOptionsDialog}
        transactionId={props.transactionId}
        onClose={handleCloseEditTransactionMoreOptionsDialog}
        onSave={handleSaveTransactionMoreOptions}
      />
      <Dialog open={props.open} onClose={props.onClose}>
        <DialogTitle>Edit Transaction</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '300px' }}>
            <TextField
              label="Transaction Date"
              value={formatDate(props.transaction.transactionDate)}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              sx={{ marginTop: '6px' }}
            />
            <TextField
              label="Amount"
              value={formatCurrency(-props.transaction.amount)}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
            />
            <TextField
              label="Description"
              value={userDescription}
              onChange={(event) => setUserDescription(event.target.value)}
              fullWidth
            />
            <TextField
              label="Inferred Category"
              value={props.inferredCategory?.name || 'Uncategorized'}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
            />
            <FormControlLabel
              control={<Checkbox checked={overrideCategory} onChange={handleSetOverrideCategory} />}
              label="Override category?"
            />
            {overrideCategory && (
              <SelectCategory
                selectedCategoryId={overrideCategoryId}
                onSetCategoryId={handleSetOverrideCategoryId}
              />
            )}
            <Button onClick={handleEditTransactionMoreOptions}>More options</Button>

            {/* <FormControlLabel
              control={<Checkbox checked={overrideTransactionsRequired} onChange={handleSetOverrideTransactionsRequired} />}
              label="Override transactions required?"
            />
            {overrideTransactionsRequired && (
              <FormControlLabel
                control={<Checkbox checked={overriddenTransactionRequired} onChange={handleSetOverriddenTransactionRequired} />}
                label="Transaction required?"
              />
            )} */}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

function mapStateToProps(state: any, ownProps: EditTransactionDialogPropsFromParent) {
  return {
    transactionId: ownProps.transactionId,
    transaction: getTransactionById(state, ownProps.transactionId) as Transaction,
    inferredCategory: getCategoryByTransactionId(state, ownProps.transactionId),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
    onAddCategory: addCategory,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(EditTransactionDialog);
