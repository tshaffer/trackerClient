import React, { useRef, useEffect, useState, ReactNode } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { v4 as uuidv4 } from 'uuid';

import { cloneDeep, isNil } from 'lodash';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, DialogActions, DialogContent, DialogContentText, FormControl, InputLabel, ListItemText, Menu, MenuItem, Select, SelectChangeEvent, Tooltip } from '@mui/material';

import { getAppInitialized, getCategories, getUnidentifiedBankTransactionById } from '../selectors';
import { BankTransaction, Category, CategoryMenuItem, DisregardLevel, SidebarMenuButton, StringToCategoryMenuItemLUT } from '../types';
import { addCategoryServerAndRedux } from '../controllers';
import { TrackerDispatch } from '../models';
import AddCategoryDialog from './AddCategoryDialog';

export interface AddRuleDialogPropsFromParent {
  open: boolean;
  unidentifiedBankTransactionId: string;
  onAddRule: (pattern: string, categoryId: string) => void;
  onClose: () => void;
}

export interface AddRuleDialogProps extends AddRuleDialogPropsFromParent {
  appInitialized: boolean;
  unidentifiedBankTransaction: BankTransaction | null;
  categories: Category[];
  onAddCategory: (category: Category) => any;
}

const AddRuleDialog = (props: AddRuleDialogProps) => {

  const [newCategoryDialogOpen, setNewCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const getTransactionDetails = (bankTransaction: BankTransaction | null): string => {
    if (isNil(bankTransaction)) {
      // debugger;
      return '';
    }
    return bankTransaction.userDescription;
  }

  const { open, onClose } = props;

  const [pattern, setPattern] = React.useState(getTransactionDetails(props.unidentifiedBankTransaction));
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>('');
  const textFieldRef = useRef(null);

  useEffect(() => {
    setPattern(getTransactionDetails(props.unidentifiedBankTransaction));
  }, [props.open, props.unidentifiedBankTransactionId, props.unidentifiedBankTransaction]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        if (open && textFieldRef.current) {
          (textFieldRef.current as any).focus();
          setSelectedCategoryId('');
        }
      }, 200);
    }
  }, [open]);

  // if (!props.appInitialized) {
  //   return null;
  // }

  if (!open) {
    return null;
  }

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

  const handleClose = () => {
    onClose();
  };

  const handleAddRule = (): void => {
    if (selectedCategoryId === '') {
      setAlertDialogOpen(true);
      return;
    }
    if (pattern !== '') {
      props.onAddRule(pattern, selectedCategoryId);
      props.onClose();
    }
  };

  const handleKeyDown = (event: { key: string; preventDefault: () => void; }) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission
      handleAddRule();
    }
  };

  function handleCategoryChange(event: SelectChangeEvent<string>): void {
    console.log('handleCategoryChange event, categoryId: ', event.target.value);
    setSelectedCategoryId(event.target.value)
  }

  const handleOpenNewCategoryDialog = () => {
    setNewCategoryDialogOpen(true);
  };

  const handleCloseNewCategoryDialog = () => {
    setNewCategoryDialogOpen(false);
    setNewCategoryName('');
  };

  const handleCloseAlertDialog = () => {
    setAlertDialogOpen(false);
  };

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

  const renderUnidentifiedBankTransaction = (): JSX.Element => {
    if (isNil(props.unidentifiedBankTransaction)) {
      return <></>;
    } else {
      return <TextField
        defaultValue={getTransactionDetails(props.unidentifiedBankTransaction)}
        inputProps={{ readOnly: true }}
        disabled
      />
    }
  }

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
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{SidebarMenuButton.CategoryAssignmentRules}</DialogTitle>
        <DialogContent style={{ paddingBottom: '0px' }}>
          <p>
            Each transaction will automatically be assigned a category based on the existing category associated with it, if available.
          </p>
          <p>
            In some cases, you may want to override the default category assignment by specifying rules based on text patterns found in the transaction's description or existing category. When a transaction matches one of these patterns, it will be assigned the associated category you have specified.
          </p>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            onKeyDown={handleKeyDown}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '500px' }}
          >
            {renderUnidentifiedBankTransaction()}
            <TextField
              label="Pattern"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              inputRef={textFieldRef}
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
          <Button onClick={handleClose}>Cancel</Button>
          <Tooltip title="Press Enter to add the category assignment rule" arrow>
            <Button onClick={handleAddRule} autoFocus variant="contained" color="primary">
              Add
            </Button>
          </Tooltip>
        </DialogActions>
      </Dialog>

      <AddCategoryDialog
        open={newCategoryDialogOpen}
        onAddCategory={handleAddCategory}
        onClose={handleCloseNewCategoryDialog}
      />

      <Dialog onClose={handleCloseAlertDialog} open={alertDialogOpen}
      >
        <DialogTitle id="alert-dialog-title">
          {'Category Required'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please select a category for the rule.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlertDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

function mapStateToProps(state: any, ownProps: AddRuleDialogPropsFromParent) {
  return {
    appInitialized: getAppInitialized(state),
    unidentifiedBankTransaction: getUnidentifiedBankTransactionById(state, ownProps.unidentifiedBankTransactionId),
    categories: getCategories(state),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
    onAddCategory: addCategoryServerAndRedux,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(AddRuleDialog);
