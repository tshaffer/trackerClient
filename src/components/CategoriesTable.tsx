import React from 'react';

import '../styles/Tracker.css';
import { Category, CategoryAssignmentRule } from '../types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Box, IconButton } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

import { TrackerDispatch } from '../models';
import { getAppInitialized, getCategories, getCategoryAssignemntRules } from '../selectors';


interface CategoriesTableProps {
  appInitialized: boolean;
  categories: Category[];
  categoryAssignmentRules: CategoryAssignmentRule[];
}

const CategoriesTable: React.FC<CategoriesTableProps> = (props: CategoriesTableProps) => {

  if (!props.appInitialized) {
    return null;
  }

  const [openRows, setOpenRows] = React.useState<{ [key: string]: boolean }>({});

  const getRulesByCategory = (categoryId: string): CategoryAssignmentRule[] => {
    return props.categoryAssignmentRules.filter((rule: CategoryAssignmentRule) => rule.categoryId === categoryId);
  }

  const getNumberOfRulesByCategory = (categoryId: string): number => {
    return getRulesByCategory(categoryId).length;
  }

  const categories: Category[] = props.categories
    .map((category: Category) => category)
    .sort((a, b) => (a.name).localeCompare(b.name));

  function handleToggle(id: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <Box sx={{ width: '100%' }}>
      <div className="table-container">
        <div className="table-header">
          <div className="table-row">
            <div className="table-cell"></div>
            <div className="table-cell">Category Name</div>
            <div className="table-cell">Number of Rules</div>
          </div>
        </div>
        <div className="catalog-table-body">
          {categories.map((category: Category) => (
            <React.Fragment key={category.id}>
              <div className="table-row">
                <div className="table-cell">
                <IconButton onClick={() => handleToggle(category.id)}>
                    {openRows[category.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                  </IconButton>
                </div>
                <div className="table-cell">{category.name}</div>
                <div className="table-cell">{getNumberOfRulesByCategory(category.id)}</div>
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
    categoryAssignmentRules: getCategoryAssignemntRules(state),
  }
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesTable);
