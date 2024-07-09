import React, { useState } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControl, InputLabel, Select, MenuItem, Box,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { Category, CheckTransaction } from '../types';
import { TrackerDispatch } from '../models';
import { getUnidentifiedBankTransactionById, getCategories } from '../selectors';
import { formatCurrency, formatDate } from '../utilities';
import { updateCheckTransaction } from '../controllers';

export interface EditCheckDialogPropsFromParent {
  open: boolean;
  unidentifiedBankTransactionId: string;
  onClose: () => void;
  onSave: (updatedCheck: CheckTransaction) => void;
}

interface EditCheckDialogProps extends EditCheckDialogPropsFromParent {
  check: CheckTransaction;
  categories: Category[];
  onUpdateCheckTransaction: (check: CheckTransaction) => any;
}

const EditCheckDialog = (props: EditCheckDialogProps) => {

  if (!props.open) {
    return null;
  }

  const [payee, setPayee] = useState(props.check.payee);
  const [checkNumber, setCheckNumber] = useState(props.check.checkNumber);
  const [category, setCategory] = useState(props.check.category);
  const [checkNumberError, setCheckNumberError] = useState<string | null>(null);
  const [userDescription, setUserDescription] = useState(props.check.userDescription);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const handleSave = () => {
    if (!validateCheckNumber(checkNumber)) {
      setCheckNumberError('Check number must be a valid number');
      return;
    }
    const updatedCheck = { ...props.check, payee, checkNumber, category };
    // props.onSave(updatedCheck);
    props.onUpdateCheckTransaction(updatedCheck);
    props.onClose();
  };

  const validateCheckNumber = (value: string): boolean => {
    return value === '' || !isNaN(Number(value));
  };

  const handleCheckNumberBlur = () => {
    if (!validateCheckNumber(checkNumber)) {
      setCheckNumberError('Check number must be a valid number');
    } else {
      setCheckNumberError(null);
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setIsCheckboxChecked(isChecked);
    if (isChecked) {
      setUserDescription(`Check number: ${checkNumber}, ${payee}`);
    }
  };

  React.useEffect(() => {
    if (isCheckboxChecked) {
      setUserDescription(`Check number: ${checkNumber}, ${payee}`);
    }
  }, [checkNumber, payee, isCheckboxChecked]);

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Edit Check</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '300px' }}>
          <TextField
            label="Transaction Date"
            value={formatDate(props.check.transactionDate)}
            InputProps={{
              readOnly: true,
            }}
            fullWidth
          />
          <TextField
            label="Amount"
            value={formatCurrency(-props.check.amount)}
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
            label="Check Number"
            value={checkNumber}
            onChange={(e) => setCheckNumber(e.target.value)}
            onBlur={handleCheckNumberBlur}
            error={!!checkNumberError}
            helperText={checkNumberError}
            fullWidth
          />
          <FormControlLabel
            control={<Checkbox checked={isCheckboxChecked} onChange={handleCheckboxChange} />}
            label="Derive description"
          />
          <TextField
            label="Description"
            value={userDescription}
            disabled={isCheckboxChecked}
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

function mapStateToProps(state: any, ownProps: EditCheckDialogPropsFromParent) {
  return {
    // unidentifiedBankTransaction: getUnidentifiedBankTransactionById(state, ownProps.unidentifiedBankTransactionId),
    check: getUnidentifiedBankTransactionById(state, ownProps.unidentifiedBankTransactionId) as CheckTransaction,
    categories: getCategories(state),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
    onUpdateCheckTransaction: updateCheckTransaction,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(EditCheckDialog);
