import React, { useRef, useEffect } from 'react';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, DialogActions, DialogContent, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Tooltip } from '@mui/material';
import { getAppInitialized, getUnidentifiedBankTransactionById } from '../selectors';
import { BankTransactionEntity, BankTransactionType, CategoryEntity, CheckingAccountTransactionEntity, CreditCardTransactionEntity } from '../types';
import { getCategories } from '../selectors/categoryState';
import { cloneDeep, isNil } from 'lodash';

export interface AddRuleDialogPropsFromParent {
  open: boolean;
  unidentifiedBankTransactionId: string;
  onAddRule: (
    categoryKeyword: string,
    categoryId: string,
  ) => void;
  onClose: () => void;
}

export interface AddRuleDialogProps extends AddRuleDialogPropsFromParent {
  appInitialized: boolean;
  unidentifiedBankTransaction: BankTransactionEntity | null;
  categoryEntities: CategoryEntity[];
}

const AddRuleDialog = (props: AddRuleDialogProps) => {

  const getTransactionDetails = (bankTransactionEntity: BankTransactionEntity | null): string => {
    if (isNil(bankTransactionEntity)) {
      // debugger;
      return '';
    }
    if (bankTransactionEntity.bankTransactionType === BankTransactionType.CreditCard) {
      return (bankTransactionEntity as CreditCardTransactionEntity).description;
    } else {
      return (bankTransactionEntity as CheckingAccountTransactionEntity).name;
    }
  }

  const { open, onClose } = props;

  const [categoryKeyword, setCategoryKeyword] = React.useState(getTransactionDetails(props.unidentifiedBankTransaction));
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>('');
  const textFieldRef = useRef(null);

  useEffect(() => {
    setCategoryKeyword(getTransactionDetails(props.unidentifiedBankTransaction));
  }, [props.open, props.unidentifiedBankTransactionId, props.unidentifiedBankTransaction]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        if (open && textFieldRef.current) {
          (textFieldRef.current as any).focus();
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

  const sortCategoryEntities = (categoryEntities: CategoryEntity[]): CategoryEntity[] => {
    return categoryEntities.sort((a, b) => {
      if (a.keyword < b.keyword) {
        return -1;
      }
      if (a.keyword > b.keyword) {
        return 1;
      }
      return 0;
    });
  };

  const handleClose = () => {
    onClose();
  };

  const handleAddRule = (): void => {
    if (categoryKeyword !== '') {
      props.onAddRule(categoryKeyword, selectedCategoryId);
      props.onClose();
    }
  };

  const handleKeyDown = (event: { key: string; preventDefault: () => void; }) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission
      handleAddRule();
    }
  };

  const handleCategoryKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryKeyword(event.target.value);
  };

  function handleCategoryChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setSelectedCategoryId(event.target.value as string);
  }

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

  let alphabetizedCategoryEntities: CategoryEntity[] = cloneDeep(props.categoryEntities);
  alphabetizedCategoryEntities = sortCategoryEntities(alphabetizedCategoryEntities);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Add Category Keyword</DialogTitle>
      <DialogContent style={{ paddingBottom: '0px' }}>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onKeyDown={handleKeyDown}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '300px' }}
        >
          {renderUnidentifiedBankTransaction()}
          <TextField
              margin="normal"
              label="Category Keyword"
              variant="outlined"
              value={categoryKeyword}
              onChange={handleCategoryKeywordChange}
              inputRef={textFieldRef}
              fullWidth
          />
            <div>
              <TextField
                id="category"
                select
                label="Select"
                value={selectedCategoryId}
                helperText="Select the associated category"
                variant="standard"
                onChange={handleCategoryChange}
              >
                {alphabetizedCategoryEntities.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.keyword}
                  </MenuItem>
                ))}
              </TextField>
            </div>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Tooltip title="Press Enter to add the category keyword" arrow>
          <Button onClick={handleAddRule} autoFocus variant="contained" color="primary">
            Add
          </Button>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
};

function mapStateToProps(state: any, ownProps: AddRuleDialogPropsFromParent) {
  return {
    appInitialized: getAppInitialized(state),
    unidentifiedBankTransaction: getUnidentifiedBankTransactionById(state, ownProps.unidentifiedBankTransactionId),
    categoryEntities: getCategories(state),
  };
}

export default connect(mapStateToProps)(AddRuleDialog);
