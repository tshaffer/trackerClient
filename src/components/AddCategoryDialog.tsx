import React, { useRef, useEffect, SyntheticEvent } from 'react';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, Checkbox, DialogActions, DialogContent, FormControlLabel, Tooltip } from '@mui/material';
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

  const renderTree = (nodes: any) => (
    <TreeItem
      key={nodes.id}
      label={nodes.name}
      itemId={nodes.id}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node: any) => renderTree(node))
        : null}
    </TreeItem>
  );

  const buildTree = () => {
    const map: any = {};
    const roots: any = [];
    props.categories.forEach((category) => {
      map[category.id] = { ...category, children: [] };
    });
    props.categories.forEach(category => {
      if (category.parentId === '') {
        roots.push(map[category.id]);
      } else {
        map[category.parentId].children.push(map[category.id]);
      }
    });
    return roots;
  };

  const categoryTree = buildTree();

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
            <SimpleTreeView
              onSelectedItemsChange={handleSelectedItemsChange}
            >
              {categoryTree.map((node: any) => renderTree(node))}
            </SimpleTreeView>
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



