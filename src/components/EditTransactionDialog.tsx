import React, { ChangeEvent, ReactNode, useState } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { v4 as uuidv4 } from 'uuid';

import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
  ListItemText
} from '@mui/material';
import { Category, CategoryMenuItem, DisregardLevel, StringToCategoryMenuItemLUT, Transaction } from '../types';
import { TrackerDispatch, setOverrideCategory, setOverrideCategoryId } from '../models';
import { getCategories, getCategoryByTransactionId, getOverrideCategory, getOverrideCategoryId, getTransactionById } from '../selectors';
import { formatCurrency, formatDate } from '../utilities';
import { cloneDeep, over } from 'lodash';
import AddCategoryDialog from './AddCategoryDialog';
import { addCategoryServerAndRedux } from '../controllers';

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
  const [newCategoryDialogOpen, setNewCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  // const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>('');
  const [anchorEl, setAnchorEl] = React.useState(null);

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

  const buildCategoryMenuItems = () => {
    const map: StringToCategoryMenuItemLUT = {};
    const roots: CategoryMenuItem[] = [];
    alphabetizedCategories.forEach(category => {
      map[category.id] = { ...category, children: [], level: (category.parentId !== '') ? map[category.parentId]?.level + 1 : 0 };
    });
    alphabetizedCategories.forEach(category => {
      if (category.parentId === '') {
        roots.push(map[category.id]);
      } else {
        map[category.parentId].children.push(map[category.id]);
      }
    });
    const flattenTree = (categoryMenuItems: CategoryMenuItem[], result: CategoryMenuItem[] = []) => {
      categoryMenuItems.forEach((categoryMenuItem: CategoryMenuItem) => {
        result.push(categoryMenuItem);
        if (categoryMenuItem.children.length > 0) {
          flattenTree(categoryMenuItem.children, result);
        }
      });
      return result;
    };
    return flattenTree(roots);
  };


  const handleSave = () => {
    const updatedTransaction: Transaction = { ...props.transaction, userDescription };
    props.onSave(updatedTransaction);
    props.onClose();
  };

  function handleCheckboxChange(event: ChangeEvent<HTMLInputElement>, checked: boolean): void {
    props.onSetOverrideCategory(props.transactionId, event.target.checked);
  }

  const handleAddCategory = (
    categoryLabel: string,
    isSubCategory: boolean,
    parentId: string,
  ): void => {
    const id: string = uuidv4();
    const category: Category = {
      id,
      name: categoryLabel,
      parentId,
      disregardLevel: DisregardLevel.None,
    };
    const addedCategory: Category = props.onAddCategory(category);
    console.log('addedCategory: ', addedCategory);
    setSelectedCategoryId(category.id);
  };

  const handleSelectClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    handleSelectClose();
  };

  function handleCategoryChange(event: SelectChangeEvent<string>, child: ReactNode): void {
    setSelectedCategoryId(event.target.value)
  }

  const handleOpenNewCategoryDialog = () => {
    setNewCategoryDialogOpen(true);
  };

  const handleCloseNewCategoryDialog = () => {
    setNewCategoryDialogOpen(false);
    setNewCategoryName('');
  };

  const renderCategoryMenuItem = (categoryMenuItem: CategoryMenuItem) => {
    return (
      <MenuItem
        key={categoryMenuItem.id}
        onClick={() => handleMenuItemClick(categoryMenuItem.id)}
        style={{ paddingLeft: `${(categoryMenuItem.level || 0) * 20}px` }}
        value={categoryMenuItem.id}
      >
        <ListItemText primary={categoryMenuItem.name} />
      </MenuItem>
    );
  };

  let alphabetizedCategories: Category[] = cloneDeep(props.categories);
  alphabetizedCategories = sortCategories(alphabetizedCategories);

  const categoryMenuItems: CategoryMenuItem[] = buildCategoryMenuItems();

  return (
    <React.Fragment>
      <AddCategoryDialog
        open={newCategoryDialogOpen}
        onAddCategory={handleAddCategory}
        onClose={handleCloseNewCategoryDialog}
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
            <div>
              <FormControl fullWidth>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  value={selectedCategoryId}
                  onChange={handleCategoryChange}
                  renderValue={(selected) => {
                    if (!selected) {
                      return <em>Select the associated category</em>;
                    }
                    const selectedCategory = alphabetizedCategories.find(category => category.id === selected);
                    return selectedCategory ? selectedCategory.name : '';
                  }}
                >
                  {categoryMenuItems.map((item) => renderCategoryMenuItem(item))}
                  <MenuItem onClick={handleOpenNewCategoryDialog}>
                    <Button fullWidth>Add New Category</Button>
                  </MenuItem>
                </Select>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleSelectClose}
                  PaperProps={{
                    style: {
                      maxHeight: 400,
                      width: '20ch',
                    },
                  }}
                >
                  {categoryMenuItems.map((item) => renderCategoryMenuItem(item))}
                  <MenuItem onClick={handleOpenNewCategoryDialog}>
                    <Button fullWidth>Add New Category</Button>
                  </MenuItem>
                </Menu>
              </FormControl>
            </div>
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
