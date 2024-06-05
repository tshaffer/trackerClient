import * as React from 'react';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, DialogActions, DialogContent, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { getAppInitialized } from '../selectors';
import { CategoryEntity } from '../types';
import { getCategories } from '../selectors/categoryState';

export interface AddCategoryKeywordDialogPropsFromParent {
  open: boolean;
  onAddCategoryKeyword: (
    categoryKeyword: string,
    categoryId: string,
  ) => void;
  onClose: () => void;
}

export interface AddCategoryKeywordDialogProps extends AddCategoryKeywordDialogPropsFromParent {
  appInitialized: boolean;
  categoryEntities: CategoryEntity[];
}

const AddCategoryKeywordDialog = (props: AddCategoryKeywordDialogProps) => {

  const { open, onClose } = props;

  const [categoryKeyword, setCategoryKeyword] = React.useState('');
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>('');

  // if (!props.appInitialized) {
  //   return null;
  // }

  if (!open) {
    return null;
  }

  const handleClose = () => {
    onClose();
  };

  const handleCategoryKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryKeyword(event.target.value);
  };

  function handleCategoryChange(event: SelectChangeEvent<string>, child: React.ReactNode): void {
    setSelectedCategoryId(event.target.value as string);
  }

  const handleAddCategoryKeyword = (): void => {
    if (categoryKeyword !== '') {
      props.onAddCategoryKeyword(categoryKeyword, selectedCategoryId);
      props.onClose();
    }
  };


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
              {props.categoryEntities.map((category) => (
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
        <Button onClick={handleAddCategoryKeyword} autoFocus>Add</Button>
      </DialogActions>

    </Dialog>
  );
};

function mapStateToProps(state: any) {
  return {
    appInitialized: getAppInitialized(state),
    categoryEntities: getCategories(state),
  };
}

export default connect(mapStateToProps)(AddCategoryKeywordDialog);



