import React, { ChangeEvent, useState } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box,
  Checkbox,
  FormControlLabel} from '@mui/material';
import { Category, Transaction } from '../types';
import { TrackerDispatch, setOverrideCategory, setOverrideCategoryId } from '../models';
import { getCategories, getCategoryByTransactionId, getOverrideCategory, getOverrideCategoryId, getTransactionById } from '../selectors';
import { formatCurrency, formatDate } from '../utilities';
import { cloneDeep } from 'lodash';
import { addCategoryServerAndRedux } from '../controllers';
import SelectCategory from './SelectCategory';

export interface EditTransactionDialogPropsFromParent {
  open: boolean;
  transactionId: string;
  onClose: () => void;
  onSave: (updatedTransaction: Transaction) => void;
}

interface EditTransactionDialogProps extends EditTransactionDialogPropsFromParent {
  transaction: Transaction;
  inferredCategory: Category | null | undefined;
  categories: Category[];
  overrideCategory: boolean;
  overrideCategoryId: string;
  onAddCategory: (category: Category) => any;
  onSetOverrideCategory: (transactionId: string, overrideCategory: boolean) => any;
  onSetOverrideCategoryId: (transactionId: string, overrideCategoryId: string) => any;
}

const EditTransactionDialog = (props: EditTransactionDialogProps) => {

  if (!props.open) {
    return null;
  }

  // const [overrideCategory, setOverrideCategory] = React.useState(false);
  const [userDescription, setUserDescription] = useState(props.transaction.userDescription);
  // const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>('');

  const sortCategories = (categories: Category[]): Category[] => {
    return categories.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  };

  const handleSave = () => {
    const updatedTransaction: Transaction = { ...props.transaction, userDescription };
    props.onSave(updatedTransaction);
    props.onClose();
  };

  function handleCheckboxChange(event: ChangeEvent<HTMLInputElement>, checked: boolean): void {
    props.onSetOverrideCategory(props.transactionId, event.target.checked);
  }

  let alphabetizedCategories: Category[] = cloneDeep(props.categories);
  alphabetizedCategories = sortCategories(alphabetizedCategories);


  function handleSetCategoryId(categoryId: string): void {
    console.log('handleSetCategoryId:', categoryId);
  }

  return (
    <React.Fragment>
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
              control={<Checkbox checked={props.transaction.overrideCategory} onChange={handleCheckboxChange} />}
              label="Override category?"
            />
            <SelectCategory
              onSetCategoryId={handleSetCategoryId}
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

function mapStateToProps(state: any, ownProps: EditTransactionDialogPropsFromParent) {
  return {
    transaction: getTransactionById(state, ownProps.transactionId) as Transaction,
    inferredCategory: getCategoryByTransactionId(state, ownProps.transactionId),
    categories: getCategories(state),
    overrideCategory: getOverrideCategory(state, ownProps.transactionId),
    overrideCategoryId: getOverrideCategoryId(state, ownProps.transactionId),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
    onAddCategory: addCategoryServerAndRedux,
    onSetOverrideCategory: setOverrideCategory,
    onSetOverrideCategoryId: setOverrideCategoryId,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(EditTransactionDialog);
