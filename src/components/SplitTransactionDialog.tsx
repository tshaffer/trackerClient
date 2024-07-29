import React, { useState } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Box,
  TextField
} from '@mui/material';
import { TrackerDispatch } from '../models';

export interface SplitTransactionDialogPropsFromParent {
  transactionId: string;
  open: boolean;
  onClose: () => void;
  onSave: (splits: any) => void;
}

interface SplitTransactionDialogProps extends SplitTransactionDialogPropsFromParent {
}

const SplitTransactionDialog = (props: SplitTransactionDialogProps) => {

  if (!props.open) {
    return null;
  }

  const [splits, setSplits] = useState([{ amount: '', description: '' }]);

  const handleSplitChange = (index: number, field: string, value: string | number) => {
    const newSplits: any[] = [...splits];
    newSplits[index][field] = value;
    setSplits(newSplits);
  };

  const handleAddSplit = () => {
    setSplits([...splits, { amount: '',description: '' }]);
  };

  const handleSave = () => {
    props.onSave(splits);
  };

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle sx={{ paddingBottom: '0px' }}>Split Transaction</DialogTitle>
      <DialogContent sx={{ paddingBottom: '0px' }}>
        {splits.map((split, index) => (
          <Box key={index} mb={2}>
            <TextField
              label="Amount"
              value={split.amount}
              onChange={(e) => handleSplitChange(index, 'amount', parseInt(e.target.value))}
              fullWidth
            />
            <TextField
              label="Description"
              value={split.description}
              onChange={(e) => handleSplitChange(index, 'description', e.target.value)}
              fullWidth
            />
          </Box>
        ))}
        <Button onClick={handleAddSplit}>Add Another Split</Button>
      </DialogContent>
      <DialogActions sx={{ paddingTop: '0px' }}>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

function mapStateToProps(state: any, ownProps: SplitTransactionDialogPropsFromParent) {
  return {
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SplitTransactionDialog);
