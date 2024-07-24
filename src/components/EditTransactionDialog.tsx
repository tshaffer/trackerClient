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

export interface EditTransactionDialogPropsFromParent {
  open: boolean;
  transactionId: string;
  onClose: () => void;
  onSave: (updatedTransaction: Transaction) => void;
}

interface EditTransactionDialogProps extends EditTransactionDialogPropsFromParent {
  transaction: Transaction;
  inferredCategory: Category | null | undefined;
}

const EditTransactionDialog = (props: EditTransactionDialogProps) => {

  if (!props.open) {
    return null;
  }

  const [overrideCategory, setOverrideCategory] = React.useState(false);
  const [userDescription, setUserDescription] = useState(props.transaction.userDescription);

  const handleSave = () => {
    const updatedTransaction: Transaction = { ...props.transaction, userDescription };
    props.onSave(updatedTransaction);
    props.onClose();
  };

  function handleCheckboxChange(event: ChangeEvent<HTMLInputElement>, checked: boolean): void {
    setOverrideCategory(event.target.checked);
  }

  return (
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
            control={<Checkbox checked={overrideCategory} onChange={handleCheckboxChange} />}
            label="Override category?"
          />
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
  );
};

function mapStateToProps(state: any, ownProps: EditTransactionDialogPropsFromParent) {
  return {
    transaction: getTransactionById(state, ownProps.transactionId) as Transaction,
    inferredCategory: getCategoryByTransactionId(state, ownProps.transactionId),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(EditTransactionDialog);
