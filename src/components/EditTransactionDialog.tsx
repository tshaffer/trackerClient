import React, { useState } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box
} from '@mui/material';
import { Transaction } from '../types';
import { TrackerDispatch } from '../models';
import { getTransactionById } from '../selectors';
import { formatCurrency, formatDate } from '../utilities';

export interface EditTransactionDialogPropsFromParent {
  open: boolean;
  transactionId: string;
  onClose: () => void;
  onSave: (updatedTransaction: Transaction) => void;
}

interface EditTransactionDialogProps extends EditTransactionDialogPropsFromParent {
  transaction: Transaction;
}

const EditTransactionDialog = (props: EditTransactionDialogProps) => {

  if (!props.open) {
    return null;
  }

  console.log('EditTransactionDialog: ', props.transactionId, props.transaction);

  const [userDescription, setUserDescription] = useState(props.transaction.userDescription);

  const handleSave = () => {
    const updatedTransaction: Transaction = { ...props.transaction, userDescription };
    // props.onSave(updatedTransaction);
    console.log('handleSave: ', updatedTransaction);
    props.onClose();
  };

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Edit Check</DialogTitle>
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
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(EditTransactionDialog);
