import React, { useState } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControl, InputLabel, Select, MenuItem, Box
} from '@mui/material';
import { Category, CheckTransaction } from '../types';
import { TrackerDispatch } from '../models';
import { getUnidentifiedBankTransactionById, getCategories } from '../selectors';

export interface EditCheckDialogPropsFromParent {
  open: boolean;
  unidentifiedBankTransactionId: string;
  onClose: () => void;
  onSave: (updatedCheck: CheckTransaction) => void;
}

interface EditCheckDialogProps extends EditCheckDialogPropsFromParent {
  check: CheckTransaction;
  categories: Category[];
}

const EditCheckDialog = (props: EditCheckDialogProps) => {

  if (!props.open) {
    return null;
  }

  const [payee, setPayee] = useState(props.check.payee);
  const [checkNumber, setCheckNumber] = useState(props.check.checkNumber);
  const [category, setCategory] = useState(props.check.category);

  const handleSave = () => {
    const updatedCheck = { ...props.check, payee, checkNumber, category };
    props.onSave(updatedCheck);
  };

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Edit CheckingAccountTransaction</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '300px' }}>
          <TextField
            label="Transaction Date"
            value={props.check.transactionDate}
            InputProps={{
              readOnly: true,
            }}
            fullWidth
          />
          <TextField
            label="Amount"
            value={props.check.amount}
            InputProps={{
              readOnly: true,
            }}
            fullWidth
          />
          <TextField
            label="Payee"
            value={payee}
            onChange={(e) => setPayee(e.target.value)}
            fullWidth
          />
          <TextField
            label="CheckingAccountTransaction Number"
            value={checkNumber}
            onChange={(e) => setCheckNumber(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              onChange={(e) => setCategory(e.target.value as string)}
              label="Category"
            >
              {props.categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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

function mapStateToProps(state: any, ownProps: EditCheckDialogPropsFromParent) {
  return {
    // unidentifiedBankTransaction: getUnidentifiedBankTransactionById(state, ownProps.unidentifiedBankTransactionId),
    check: getUnidentifiedBankTransactionById(state, ownProps.unidentifiedBankTransactionId) as CheckTransaction,
    categories: getCategories(state),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(EditCheckDialog);
