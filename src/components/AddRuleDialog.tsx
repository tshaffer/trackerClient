import * as React from 'react';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, DialogActions, DialogContent, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
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

  React.useEffect(() => {
    setCategoryKeyword(getTransactionDetails(props.unidentifiedBankTransaction));
  }, [props.open, props.unidentifiedBankTransactionId, props.unidentifiedBankTransaction]);

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

  const handleCategoryKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryKeyword(event.target.value);
  };

  function handleCategoryChange(event: SelectChangeEvent<string>, child: React.ReactNode): void {
    setSelectedCategoryId(event.target.value as string);
  }

  const handleAddRule = (): void => {
    if (categoryKeyword !== '') {
      props.onAddRule(categoryKeyword, selectedCategoryId);
      props.onClose();
    }
  };

  const getUnidentifiedBankTransaction = (): JSX.Element => {
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
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '300px' }}
        >
          {getUnidentifiedBankTransaction()}
          {/* <TextField
            defaultValue={getTransactionDetails(props.unidentifiedBankTransaction)}
            inputProps={{ readOnly: true }}
            disabled
          /> */}
          <TextField
            label="Category Keyword"
            variant="outlined"
            value={categoryKeyword}
            onChange={handleCategoryKeywordChange}
            required
          />
          <FormControl variant="outlined" required>
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              value={selectedCategoryId}
              onChange={handleCategoryChange}
              label="Category"
            >
              {alphabetizedCategoryEntities.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.keyword}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAddRule} autoFocus>Add</Button>
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



