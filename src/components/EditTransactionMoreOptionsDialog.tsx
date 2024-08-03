import React, { ChangeEvent, useState } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Box,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { Transaction } from '../types';
import { TrackerDispatch } from '../models';
import { getTransactionById } from '../selectors';

export interface EditTransactionMoreOptionsDialogPropsFromParent {
  open: boolean;
  transactionId: string;
  onClose: () => void;
  onSave: (updatedTransaction: Transaction) => void;
}

interface EditTransactionMoreOptionsDialogProps extends EditTransactionMoreOptionsDialogPropsFromParent {
  transaction: Transaction;
}

const EditTransactionMoreOptionsDialog = (props: EditTransactionMoreOptionsDialogProps) => {
  const [overrideFixedExpense, setOverrideFixedExpense] = useState(props.transaction.overrideFixedExpense);
  const [overriddenFixedExpense, setOverriddenFixedExpense] = React.useState(props.transaction.overriddenFixedExpense);
  const [excludeFromReportCalculations, setExcludeFromReportCalculations] = useState(props.transaction.excludeFromReportCalculations);

  if (!props.open) {
    return null;
  }

  const handleSave = () => {
    const updatedTransaction = {
      ...props.transaction,
      overrideFixedExpense,
      overriddenFixedExpense,
      excludeFromReportCalculations,
    };
    props.onSave(updatedTransaction);
    props.onClose();
  };

  const handleCheckboxChange = (setter: React.Dispatch<React.SetStateAction<boolean>>) => (event: ChangeEvent<HTMLInputElement>) => {
    setter(event.target.checked);
  };

  return (
    <React.Fragment>
      <Dialog open={props.open} onClose={props.onClose}>
        <DialogTitle>More Options</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column">
            <FormControlLabel
              control={
                <Checkbox
                  checked={overrideFixedExpense}
                  onChange={handleCheckboxChange(setOverrideFixedExpense)}
                  name="overrideFixedExpense"
                  color="primary"
                />
              }
              label="Override 'Fixed Expense'?"
            />
            {overrideFixedExpense && (
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{ ml: 2 }}
                    checked={overriddenFixedExpense}
                    onChange={handleCheckboxChange(setOverriddenFixedExpense)}
                  />
                }
                label="Fixed Expense?"
              />
            )}
            <FormControlLabel
              control={
                <Checkbox
                  checked={excludeFromReportCalculations}
                  onChange={handleCheckboxChange(setExcludeFromReportCalculations)}
                  name="excludeFromReportCalculations"
                  color="primary"
                />
              }
              label="Exclude from Report Calculations?"
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
    </React.Fragment>
  );
};

function mapStateToProps(state: any, ownProps: EditTransactionMoreOptionsDialogPropsFromParent) {
  return {
    transaction: getTransactionById(state, ownProps.transactionId) as Transaction,
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(EditTransactionMoreOptionsDialog);
