import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { CheckingAccountTransaction } from '../types';
import { connect } from 'react-redux';
import { getTransactionById } from '../selectors';

interface SplitTransaction {
  amount: string;
  description: string;
}

interface SplitTransactionDialogPropsFromParent {
  open: boolean;
  onClose: () => void;
  transactionId: string;
  onSave: (splits: SplitTransaction[]) => any;
}

export interface SplitTransactionDialogProps extends SplitTransactionDialogPropsFromParent {
  transaction: CheckingAccountTransaction;
}

const SplitTransactionDialog: React.FC = (props: any) => {

  console.log('SplitTransactionDialog props: ', props);

  if (!props.open) {
    return null;
  }

  const { open, onClose, transaction, onSave } = props;
  
  const [splits, setSplits] = useState<SplitTransaction[]>([
    { amount: transaction.amount.toString(), description: 'Remainder' },
  ]);
  const amountRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (transaction.amount.toString() !== splits[0].amount) {
      setSplits([{ amount: transaction.amount.toString(), description: 'Remainder' }]);
    }
  }, [transaction.amount]);

  const handleSplitChange = (index: number, field: string, value: string) => {
    const newSplits = [...splits];
    newSplits[index] = { ...newSplits[index], [field]: value };
    setSplits(newSplits);
  };

  const handleAmountBlur = (index: number) => {
    const newSplits = [...splits];
    const value = newSplits[index].amount.replace(/^\$/, '');
    const amount = parseFloat(value);

    if (isNaN(amount)) {
      newSplits[index].amount = '';
      setSplits(newSplits);
      if (amountRefs.current[index]) {
        amountRefs.current[index]!.focus();
      }
    } else {
      newSplits[index].amount = amount.toString();
      setSplits(newSplits);
      adjustRemainderAmount(newSplits);
    }
  };

  const handleAddSplit = () => {
    setSplits([
      ...splits,
      { amount: '0', description: '' },
    ]);
  };

  const handleDeleteSplit = (index: number) => {
    const newSplits = splits.filter((_, i) => i !== index);
    setSplits(newSplits);
    adjustRemainderAmount(newSplits);
  };

  const adjustRemainderAmount = (newSplits: SplitTransaction[]) => {
    const totalSplitAmount = newSplits.slice(1).reduce((sum, split) => sum + parseFloat(split.amount || '0'), 0);
    newSplits[0].amount = (transaction.amount - totalSplitAmount).toString();
    setSplits(newSplits);
  };

  const handleSave = () => {
    const totalAmount = splits.reduce((sum, split) => sum + parseFloat(split.amount || '0'), 0);
    if (totalAmount !== transaction.amount) {
      alert('The total amount of splits must equal the transaction amount.');
      return;
    }
    onSave(splits);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Split Transaction</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate autoComplete="off">
          {splits.map((split, index) => (
            <Box key={index} mb={2} display="flex" alignItems="center">
              <TextField
                label="Amount"
                type="text"
                value={split.amount}
                onChange={(e) => handleSplitChange(index, 'amount', e.target.value)}
                onBlur={() => handleAmountBlur(index)}
                fullWidth
                inputRef={(el) => (amountRefs.current[index] = el)}
                InputLabelProps={{ shrink: true }}
                style={{ marginRight: '8px' }}
              />
              <TextField
                label="Description"
                value={split.description}
                onChange={(e) => handleSplitChange(index, 'description', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                style={{ marginRight: '8px' }}
              />
              {index !== 0 && (
                <IconButton onClick={() => handleDeleteSplit(index)}>
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          ))}
          <Button onClick={handleAddSplit}>Add Another Split</Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

function mapStateToProps(state: any, ownProps: SplitTransactionDialogPropsFromParent) {
  return {
    transaction: getTransactionById(state, ownProps.transactionId) as CheckingAccountTransaction,
  };
}

export default connect(mapStateToProps)(SplitTransactionDialog);
