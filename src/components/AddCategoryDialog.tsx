import React, { useRef, useEffect, SyntheticEvent } from 'react';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, Checkbox, DialogActions, DialogContent, FormControl, FormControlLabel, InputLabel, ListItemText, Menu, MenuItem, Select, Tooltip } from '@mui/material';
import { getAppInitialized, getCategories } from '../selectors';
import { Category, CategoryMenuItem, StringToCategoryMenuItemLUT } from '../types';

export interface AddCategoryDialogPropsFromParent {
  open: boolean;
  onAddCategory: (
    categoryLabel: string,
    isSubCategory: boolean,
    parentCategoryId: string,
  ) => void;
  onClose: () => void;
}

export interface AddCategoryDialogProps extends AddCategoryDialogPropsFromParent {
  appInitialized: boolean;
  categories: Category[];
}

const AddCategoryDialog = (props: AddCategoryDialogProps) => {

  const { open, onClose } = props;

  const [categoryLabel, setCategoryLabel] = React.useState('');
  const [isSubCategory, setIsSubCategory] = React.useState(false);
  const [parentCategoryId, setParentCategoryId] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);


  const textFieldRef = useRef(null);

  useEffect(() => {
    setCategoryLabel('');
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

  if (!open) {
    return null;
  }

  const handleClose = () => {
    onClose();
  };

  const handleAddCategory = (): void => {
    if (categoryLabel !== '') {
      props.onAddCategory(categoryLabel, isSubCategory, parentCategoryId);
      props.onClose();
    }
  };

  const handleKeyDown = (event: { key: string; preventDefault: () => void; }) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission
      handleAddCategory();
    }
  };

  const handleCheckboxChange = (event: any) => {
    setIsSubCategory(event.target.checked);
    if (!event.target.checked) {
      setParentCategoryId('');
    }
  };

  const handleSelectClick = (event: { currentTarget: any; }) => {
    console.log('handleSelectClick:', event.currentTarget);
    setAnchorEl(event.currentTarget);
  };

  const handleSelectClose = () => {
    console.log('handleSelectClose');
    setAnchorEl(null);
  };

  const handleMenuItemClick = (id: string) => {
    console.log('handleMenuItemClick:', id);
    setParentCategoryId(id);
    handleSelectClose();
  };

  const renderCategoryMenuItem = (categoryMenuItem: CategoryMenuItem) => (
    <MenuItem
      key={categoryMenuItem.id}
      onClick={() => handleMenuItemClick(categoryMenuItem.id)}
      style={{ paddingLeft: `${(categoryMenuItem.level || 0) * 20}px` }}
      value={categoryMenuItem.id}
    >
      <ListItemText primary={categoryMenuItem.name} />
    </MenuItem>
  );

  // const buildCategoryMenuItems = () => {
  //   const map: any = {};
  //   const roots: any[] = [];
  //   props.categories.forEach(category => {
  //     map[category.id] = { ...category, children: [], level: (category.parentId !== '') ? map[category.parentId]?.level + 1 : 0 };
  //   });
  //   props.categories.forEach(category => {
  //     if (category.parentId === '') {
  //       roots.push(map[category.id]);
  //     } else {
  //       map[category.parentId].children.push(map[category.id]);
  //     }
  //   });
  //   const flattenTree = (nodes: any, result: any[] = []) => {
  //     nodes.forEach((node: any) => {
  //       result.push(node);
  //       if (node.children.length > 0) {
  //         flattenTree(node.children, result);
  //       }
  //     });
  //     return result;
  //   };
  //   return flattenTree(roots);
  // };

  const buildCategoryMenuItems = () => {
    const map: StringToCategoryMenuItemLUT = {};
    const roots: CategoryMenuItem[] = [];
    props.categories.forEach(category => {
      map[category.id] = { ...category, children: [], level: (category.parentId !== '') ? map[category.parentId]?.level + 1 : 0 };
    });
    props.categories.forEach(category => {
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

  const categoryMenuItems = buildCategoryMenuItems();

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Add Category</DialogTitle>
      <DialogContent style={{ paddingBottom: '0px' }}>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onKeyDown={handleKeyDown}
        >
          <div style={{ paddingBottom: '8px' }}>
            <TextField
              margin="normal"
              label="Category Label"
              value={categoryLabel}
              onChange={(event) => setCategoryLabel(event.target.value)}
              fullWidth
            />
          </div>
          <FormControlLabel
            control={<Checkbox checked={isSubCategory} onChange={handleCheckboxChange} />}
            label="Is this a subcategory?"
          />
          {isSubCategory && (
            <FormControl fullWidth>
              <InputLabel id="parent-category-label">Parent Category</InputLabel>
              <Select
                labelId="parent-category-label"
                value={parentCategoryId}
                onChange={handleSelectClick}
                label="Parent Category"
                renderValue={(selected) => {
                  if (!selected) {
                    return <em>Select Parent Category</em>;
                  }
                  const selectedCategory = props.categories.find(category => category.id === selected);
                  return selectedCategory ? selectedCategory.name : '';
                }}
              >
                {categoryMenuItems.map((item) => renderCategoryMenuItem(item))}
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
              </Menu>
            </FormControl>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Tooltip title="Press Enter to add the category" arrow>
          <Button
            onClick={handleAddCategory}
            autoFocus
            variant="contained"
            color="primary"
          // disabled={!categoryLabel || (isSubCategory && !parentCategoryId)}
          >
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
    categories: getCategories(state),
  };
}

export default connect(mapStateToProps)(AddCategoryDialog);



