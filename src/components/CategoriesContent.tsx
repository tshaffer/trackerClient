import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { v4 as uuidv4 } from 'uuid';

import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { TrackerDispatch } from '../models';
import { CategoryEntity, DisregardLevel } from '../types';
import AddCategoryDialog from './AddCategoryDialog';
import CategoriesTable from './CategoriesTable';
import { addCategoryServerAndRedux } from '../controllers';

interface CategoriesContentProps {
  onAddCategory: (categoryEntity: CategoryEntity) => any;
}

const CategoriesContent: React.FC<CategoriesContentProps> = (props: CategoriesContentProps) => {

  const [showAddCategoryDialog, setShowAddCategoryDialog] = React.useState(false);

  const handleAddCategory = (categoryLabel: string): void => {
    const id: string = uuidv4();
    const categoryEntity: CategoryEntity = {
      id,
      keyword: categoryLabel,
      disregardLevel: DisregardLevel.None,
    };
    props.onAddCategory(categoryEntity);
  };

  const handleCloseAddCategoryDialog = () => {
    setShowAddCategoryDialog(false);
  };

  return (
    <div>
      <AddCategoryDialog
        open={showAddCategoryDialog}
        onAddCategory={handleAddCategory}
        onClose={handleCloseAddCategoryDialog}
      />

      <Box sx={{ width: '100%' }}>
        <Typography variant="h5">Categories</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            startIcon={<AddIcon />}
            onClick={() => setShowAddCategoryDialog(true)}
          >
            Add
          </Button>
        </Box>
        <Box>
          <CategoriesTable />
        </Box>
      </Box>
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
    onAddCategory: addCategoryServerAndRedux,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesContent);
