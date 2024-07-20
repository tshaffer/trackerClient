import React, { useRef, useEffect, useState } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { v4 as uuidv4 } from 'uuid';

import { cloneDeep, isNil } from 'lodash';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, DialogActions, DialogContent, DialogContentText, MenuItem, Tooltip } from '@mui/material';

import { getAppInitialized, getCategories, getUnidentifiedBankTransactionById } from '../selectors';
import { BankTransaction, BankTransactionType, Category, CheckingAccountTransaction, CreditCardTransaction, DisregardLevel, SidebarMenuButton } from '../types';
import { addCategoryServerAndRedux } from '../controllers';
import { TrackerDispatch } from '../models';

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

  const handleCategoryAssignmentRuleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPattern(event.target.value);
  };

  function handleCategoryChange(event: React.ChangeEvent<HTMLInputElement>): void {
    console.log('handleCategoryChange event: ', event.target.value);
    setSelectedCategoryId(event.target.value as string);
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

  const handleAddNewCategory = (): void => {
    const id: string = uuidv4();
    const category: Category = {
      id,
      name: newCategoryName,
      parentId: '',
      disregardLevel: DisregardLevel.None,
    };
    setNewCategoryDialogOpen(false);
    setNewCategoryName('');
    const addedCategory: Category = props.onAddCategory(category);
    console.log('addedCategory: ', addedCategory);
    setSelectedCategoryId(category.id);

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

  let alphabetizedCategories: Category[] = cloneDeep(props.categories);
  alphabetizedCategories = sortCategories(alphabetizedCategories);

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
              <TextField
                id="category"
                select
                label="Category"
                value={selectedCategoryId}
                helperText="Select the associated category"
                variant="standard"
                onChange={handleCategoryChange}
              >
                {alphabetizedCategories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
                <MenuItem onClick={handleOpenNewCategoryDialog}>
                  <Button fullWidth>Add New Category</Button>
                </MenuItem>
              </TextField>
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

      <Dialog onClose={handleCloseNewCategoryDialog} open={newCategoryDialogOpen}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="New Category Name"
            variant="outlined"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewCategoryDialog}>Cancel</Button>
          <Button onClick={handleAddNewCategory} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
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
