import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { CheckingAccountTransaction } from '../types';
import { connect } from 'react-redux';
import { getTransactionById } from '../selectors';

interface SplitTransaction {
  amount: number;
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
    { amount: transaction.amount, description: 'Remainder' },
  ]);

  useEffect(() => {
    if (transaction.amount !== splits[0].amount) {
      setSplits([{ amount: transaction.amount, description: 'Remainder' }]);
    }
  }, [transaction.amount]);

  const handleSplitChange = (index: number, field: string, value: string | number) => {
    const newSplits = [...splits];
    if (field === 'amount') {
      value = parseFloat(value.toString().replace(/^\$/, ''));
    }
    newSplits[index] = { ...newSplits[index], [field]: value };
    setSplits(newSplits);
    adjustRemainderAmount(newSplits);
  };

  const handleAddSplit = () => {
    setSplits([
      ...splits,
      { amount: 0, description: '' },
    ]);
  };

  const handleDeleteSplit = (index: number) => {
    const newSplits = splits.filter((_, i) => i !== index);
    setSplits(newSplits);
    adjustRemainderAmount(newSplits);
  };

  const adjustRemainderAmount = (newSplits: SplitTransaction[]) => {
    const totalSplitAmount = newSplits.slice(1).reduce((sum, split) => sum + split.amount, 0);
    newSplits[0].amount = transaction.amount - totalSplitAmount;
    setSplits(newSplits);
  };

  const handleSave = () => {
    const totalAmount = splits.reduce((sum, split) => sum + split.amount, 0);
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
                value={`$${split.amount}`}
                onChange={(e) => handleSplitChange(index, 'amount', e.target.value)}
                fullWidth
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
