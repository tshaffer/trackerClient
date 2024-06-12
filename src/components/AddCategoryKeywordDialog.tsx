import React, { useRef, useEffect } from 'react';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, DialogActions, DialogContent, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Tooltip } from '@mui/material';
import { getAppInitialized } from '../selectors';
import { CategoryEntity } from '../types';
import { getCategories } from '../selectors/categoryState';
import { cloneDeep } from 'lodash';

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
  const textFieldRef = useRef(null);

  useEffect(() => {
    setCategoryKeyword('');
  }, [props.open]);

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

  const handleAddCategoryKeyword = (): void => {
    if (categoryKeyword !== '') {
      props.onAddCategoryKeyword(categoryKeyword, selectedCategoryId);
      props.onClose();
    }
  };

  const handleKeyDown = (event: { key: string; preventDefault: () => void; }) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission
      handleAddCategoryKeyword();
    }
  };

  const handleCategoryKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryKeyword(event.target.value);
  };

  function handleCategoryChange(event: SelectChangeEvent<string>, child: React.ReactNode): void {
    setSelectedCategoryId(event.target.value as string);
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
          <div style={{ paddingBottom: '8px' }}>
            <TextField
              margin="normal"
              label="Category Keyword"
              variant="outlined"
              value={categoryKeyword}
              onChange={handleCategoryKeywordChange}
              inputRef={textFieldRef}
              fullWidth
            />
            <FormControl variant="outlined" style={{ minWidth: '300px' }}>
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
          </div>

        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Tooltip title="Press Enter to add the category keyword" arrow>
          <Button onClick={handleAddCategoryKeyword} autoFocus variant="contained" color="primary">
            Add
          </Button>
        </Tooltip>
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



