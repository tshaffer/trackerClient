import React, { useRef, useEffect, SyntheticEvent } from 'react';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, Checkbox, DialogActions, DialogContent, FormControl, FormControlLabel, InputLabel, ListItemText, Menu, MenuItem, Select, Tooltip } from '@mui/material';
import { getAppInitialized, getCategories } from '../selectors';
import { TreeItem, SimpleTreeView } from '@mui/x-tree-view';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Category } from '../types';

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

  // return (
  //   <Dialog onClose={handleClose} open={open}>
  //     <DialogTitle>Add Category</DialogTitle>
  //     <DialogContent style={{ paddingBottom: '0px' }}>
  //       <Box
  //         component="form"
  //         noValidate
  //         autoComplete="off"
  //         onKeyDown={handleKeyDown}
  //       >
  //         <div style={{ paddingBottom: '8px' }}>
  //           <TextField
  //             margin="normal"
  //             label="Category Label"
  //             value={categoryLabel}
  //             onChange={(event) => setCategoryLabel(event.target.value)}
  //             inputRef={textFieldRef}
  //             fullWidth
  //           />
  //         </div>
  //       </Box>
  //     </DialogContent>
  //     <DialogActions>
  //       <Button onClick={handleClose}>Cancel</Button>
  //       <Tooltip title="Press Enter to add the category" arrow>
  //         <Button onClick={handleAddCategory} autoFocus variant="contained" color="primary">
  //           Add
  //         </Button>
  //       </Tooltip>
  //     </DialogActions>
  //   </Dialog>
  // );

  const handleCheckboxChange = (event: any) => {
    setIsSubCategory(event.target.checked);
    if (!event.target.checked) {
      setParentCategoryId('');
    }
  };

  function handleSelectedItemsChange(event: SyntheticEvent<Element, Event>, itemIds: string | null): void {
    console.log('handleSelectedItemsChange', itemIds);
    setParentCategoryId(itemIds as string);
  }

  // const renderTree = (nodes: any) => (
  //   <TreeItem
  //     key={nodes.id}
  //     label={nodes.name}
  //     itemId={nodes.id}
  //   >
  //     {Array.isArray(nodes.children)
  //       ? nodes.children.map((node: any) => renderTree(node))
  //       : null}
  //   </TreeItem>
  // );

  // const buildTree = () => {
  //   const map: any = {};
  //   const roots: any = [];
  //   props.categories.forEach((category) => {
  //     map[category.id] = { ...category, children: [] };
  //   });
  //   props.categories.forEach(category => {
  //     if (category.parentId === '') {
  //       roots.push(map[category.id]);
  //     } else {
  //       map[category.parentId].children.push(map[category.id]);
  //     }
  //   });
  //   return roots;
  // };

  // const categoryTree = buildTree();

  // return (
  //   <Dialog onClose={handleClose} open={open}>
  //     <DialogTitle>Add Category</DialogTitle>
  //     <DialogContent style={{ paddingBottom: '0px' }}>
  //       <Box component="form" noValidate autoComplete="off">
  //         <div style={{ paddingBottom: '8px' }}>
  //           <TextField
  //             margin="normal"
  //             label="Category Label"
  //             value={categoryLabel}
  //             onChange={(event) => setCategoryLabel(event.target.value)}
  //             fullWidth
  //           />
  //         </div>
  //         <FormControlLabel
  //           control={<Checkbox checked={isSubCategory} onChange={handleCheckboxChange} />}
  //           label="Is this a subcategory?"
  //         />
  //         {isSubCategory && (
  //           <SimpleTreeView
  //             onSelectedItemsChange={handleSelectedItemsChange}
  //           >
  //             {categoryTree.map((node: any) => renderTree(node))}
  //           </SimpleTreeView>
  //         )}
  //       </Box>
  //     </DialogContent>
  //     <DialogActions>
  //       <Button onClick={handleClose}>Cancel</Button>
  //       <Tooltip title="Press Enter to add the category" arrow>
  //         <Button
  //           onClick={handleAddCategory}
  //           autoFocus
  //           variant="contained"
  //           color="primary"
  //           disabled={!categoryLabel || (isSubCategory && !parentCategoryId)}
  //         >
  //           Add
  //         </Button>
  //       </Tooltip>
  //     </DialogActions>
  //   </Dialog>
  // );

  const handleSelectClick = (event: { currentTarget: any; }) => {
    console.log('handleSelectClick:', event.currentTarget);
    setAnchorEl(event.currentTarget);
  };

  const handleSelectClose = () => {
    console.log('handleSelectClose');
    setAnchorEl(null);
  };

  const handleMenuItemClick = (id: string) => {
    setParentCategoryId(id);
    handleSelectClose();
  };

  const renderMenuItems = (nodes: any) => (
    <MenuItem
      key={nodes.id}
      onClick={() => handleMenuItemClick(nodes.id)}
      style={{ paddingLeft: `${(nodes.level || 0) * 20}px` }}
    >
      <ListItemText primary={nodes.name} />
    </MenuItem>
  );

  const buildMenuItems = () => {
    const map: any = {};
    const roots: any[] = [];
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
    const flattenTree = (nodes: any, result: any[] = []) => {
      nodes.forEach((node: any) => {
        result.push(node);
        if (node.children.length > 0) {
          flattenTree(node.children, result);
        }
      });
      return result;
    };
    return flattenTree(roots);
  };

  const categoryMenuItems = buildMenuItems();

  console.log('re-render:');
  console.log('anchorEl: ', Boolean(anchorEl));
  console.log('parentCategoryId: ', parentCategoryId);
  console.log('categoryMenuItems: ', categoryMenuItems);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Add Category</DialogTitle>
      <DialogContent style={{ paddingBottom: '0px' }}>
        <Box component="form" noValidate autoComplete="off">
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
                onClick={handleSelectClick}
                renderValue={(selected) => {
                  if (!selected) {
                    return <em>Select Parent Category</em>;
                  }
                  const selectedCategory = props.categories.find(category => category.id === selected);
                  return selectedCategory ? selectedCategory.name : '';
                }}
              >
                {categoryMenuItems.map((item) => renderMenuItems(item))}
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
                {categoryMenuItems.map((item) => renderMenuItems(item))}
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
            disabled={!categoryLabel || (isSubCategory && !parentCategoryId)}
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



