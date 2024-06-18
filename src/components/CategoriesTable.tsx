import React from 'react';

import '../styles/Tracker.css';
import { CategoryEntity } from '../types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TrackerDispatch } from '../models';
import { getAppInitialized, getCategories } from '../selectors';
import { Box } from '@mui/material';

interface CategoriesTableProps {
  appInitialized: boolean;
  categoryEntities: CategoryEntity[];
}

const CategoriesTable: React.FC<CategoriesTableProps> = (props: CategoriesTableProps) => {

  if (!props.appInitialized) {
    return null;
  }

  const categoryEntities: CategoryEntity[] = props.categoryEntities
    .map((categoryEntity: CategoryEntity) => categoryEntity)
    .sort((a, b) => (a.keyword).localeCompare(b.keyword));

  return (
    <Box sx={{ width: '100%' }}>
      <div className="table-container">
        <div className="table-header">
          <div className="table-row">
            <div className="table-cell"></div>
            <div className="table-cell">Category</div>
          </div>
        </div>
        <div className="table-body">
          {categoryEntities.map((categoryEntity: CategoryEntity) => (
            <React.Fragment key={categoryEntity.id}>
              <div className="table-row">
                <div className="table-cell"></div>
                <div className="table-cell">{categoryEntity.keyword}</div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </Box>
  );
};


function mapStateToProps(state: any) {
  return {
    appInitialized: getAppInitialized(state),
    categoryEntities: getCategories(state),
  }
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesTable);
