import React from 'react';

import '../styles/Tracker.css';
import { Category } from '../types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TrackerDispatch } from '../models';
import { getAppInitialized, getCategories } from '../selectors';
import { Box } from '@mui/material';

interface CategoriesTableProps {
  appInitialized: boolean;
  categories: Category[];
}

const CategoriesTable: React.FC<CategoriesTableProps> = (props: CategoriesTableProps) => {

  if (!props.appInitialized) {
    return null;
  }

  const categories: Category[] = props.categories
    .map((category: Category) => category)
    .sort((a, b) => (a.name).localeCompare(b.name));

  return (
    <Box sx={{ width: '100%' }}>
      <div className="table-container">
        <div className="table-header">
          <div className="table-row">
            <div className="table-cell"></div>
            <div className="table-cell">Category</div>
          </div>
        </div>
        <div className="catalog-table-body">
          {categories.map((category: Category) => (
            <React.Fragment key={category.id}>
              <div className="table-row">
                <div className="table-cell"></div>
                <div className="table-cell">{category.name}</div>
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
    categories: getCategories(state),
  }
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesTable);
