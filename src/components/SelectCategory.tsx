import React, { useState } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { v4 as uuidv4 } from 'uuid';

import { cloneDeep } from 'lodash';

import { Button, FormControl, InputLabel, ListItemText, Menu, MenuItem, Select, SelectChangeEvent } from '@mui/material';

import { Category, CategoryMenuItem, DisregardLevel, StringToCategoryMenuItemLUT } from '../types';
import { TrackerDispatch } from '../models';
import AddCategoryDialog from './AddCategoryDialog';
import { addCategoryServerAndRedux } from '../controllers';
import { getCategories } from '../selectors';

export interface SelectCategoryPropsFromParent {
  selectedCategoryId: string;
  onSetCategoryId: (categoryId: string) => void;
}

export interface SelectCategoryProps extends SelectCategoryPropsFromParent {
  categories: Category[];
  onAddCategory: (category: Category) => any;
}

const SelectCategory = (props: SelectCategoryProps) => {

  const [newCategoryDialogOpen, setNewCategoryDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>(props.selectedCategoryId);

  React.useEffect(() => {
    setSelectedCategoryId(props.selectedCategoryId);
  }, [props.selectedCategoryId]);

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

  const buildCategoryMenuItems = (): CategoryMenuItem[] => {
    const map: StringToCategoryMenuItemLUT = {};
    const roots: CategoryMenuItem[] = [];
  
    // First pass: Create the map with children and initialize levels to -1
    alphabetizedCategories.forEach(category => {
      map[category.id] = { ...category, children: [], level: -1 };
    });
  
    // Second pass: Populate the children and identify root categories
    alphabetizedCategories.forEach(category => {
      if (category.parentId === '') {
        roots.push(map[category.id]);
      } else {
        map[category.parentId]?.children.push(map[category.id]);
      }
    });
  
    // Function to recursively calculate levels
    const calculateLevels = (category: CategoryMenuItem, level: number) => {
      category.level = level;
      category.children.forEach(child => calculateLevels(child, level + 1));
    };
  
    // Calculate levels starting from the roots
    roots.forEach(root => calculateLevels(root, 0));
  
    // Function to flatten the tree
    const flattenTree = (categoryMenuItems: CategoryMenuItem[], result: CategoryMenuItem[] = []): CategoryMenuItem[] => {
      categoryMenuItems.forEach(categoryMenuItem => {
        result.push(categoryMenuItem);
        if (categoryMenuItem.children.length > 0) {
          flattenTree(categoryMenuItem.children, result);
        }
      });
      return result;
    };
  
    return flattenTree(roots);
  };
  
  const handleSetSelectedCategoryId = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    props.onSetCategoryId(categoryId);
  }

  function handleCategoryChange(event: SelectChangeEvent<string>): void {
    handleSetSelectedCategoryId(event.target.value)
  }

  const handleOpenNewCategoryDialog = () => {
    setNewCategoryDialogOpen(true);
  };

  const handleCloseNewCategoryDialog = () => {
    setNewCategoryDialogOpen(false);
  };

  const handleAddCategory = (
    categoryLabel: string,
    isSubCategory: boolean,
    parentId: string,
    transactionsRequired: boolean,
  ): void => {
    const id: string = uuidv4();
    const category: Category = {
      id,
      name: categoryLabel,
      parentId,
      transactionsRequired,
      disregardLevel: DisregardLevel.None,
    };
    const addedCategory: Category = props.onAddCategory(category);
    handleSetSelectedCategoryId(category.id);
  };

  const handleSelectClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (categoryId: string) => {
    handleSetSelectedCategoryId(categoryId);
    handleSelectClose();
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
      <FormControl fullWidth>
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          value={selectedCategoryId}
          onChange={handleCategoryChange}
          label="Category"
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

      <AddCategoryDialog
        open={newCategoryDialogOpen}
        onAddCategory={handleAddCategory}
        onClose={handleCloseNewCategoryDialog}
      />
    </React.Fragment>
  );
}

function mapStateToProps(state: any, ownProps: SelectCategoryPropsFromParent) {
  return {
    categories: getCategories(state),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
    onAddCategory: addCategoryServerAndRedux,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectCategory);
