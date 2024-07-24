import React, { useRef, useEffect, useState } from 'react';

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
  onSetCategoryId: (categoryId: string) => void;
}

export interface SelectCategoryProps extends SelectCategoryPropsFromParent {
  categories: Category[];
  onAddCategory: (category: Category) => any;
}

const SelectCategory = (props: SelectCategoryProps) => {

  const [newCategoryDialogOpen, setNewCategoryDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>('');

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

  const handleSetSelectedCategoryId = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    props.onSetCategoryId(categoryId);
  }

  function handleCategoryChange(event: SelectChangeEvent<string>): void {
    console.log('handleCategoryChange event, categoryId: ', event.target.value);
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
