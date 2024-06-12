import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import '../styles/Tracker.css';
import { CategoryEntity, CategoryKeywordEntity } from '../types';
import { IconButton } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { TrackerDispatch } from '../models';
import { getCategories, getCategoryKeywordEntities } from '../selectors/categoryState';

interface CategoryKeywordsTableProps {
  categoryKeywordEntities: CategoryKeywordEntity[];
  categories: CategoryEntity[];
}

const CategoryKeywordsTable: React.FC<CategoryKeywordsTableProps> = (props: CategoryKeywordsTableProps) => {

  function handleButtonClick(categoryKeywordEntity: CategoryKeywordEntity): void {
    throw new Error('Function not implemented.');
  }

  const getCategory = (categoryId: string): CategoryEntity => {
    return props.categories.find((category: CategoryEntity) => category.id === categoryId) as CategoryEntity;
  };

  return (
    <React.Fragment>
      <div className="table-container">
        <div className="table-header">
          <div className="table-row">
            <div className="table-cell"></div>
            <div className="table-cell">Keyword</div>
            <div className="table-cell">Category</div>
          </div>
        </div>
        <div className="table-body">
          {props.categoryKeywordEntities.map((categoryKeywordEntity: CategoryKeywordEntity) => (
            <div className="table-row" key={categoryKeywordEntity.id}>
              <div className="table-cell">
                <IconButton onClick={() => handleButtonClick(categoryKeywordEntity)}>
                  <AssignmentIcon />
                </IconButton>
              </div>
              <div className="table-cell">{categoryKeywordEntity.keyword}</div>
              <div className="table-cell">{getCategory(categoryKeywordEntity.categoryId).keyword}</div>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}

function mapStateToProps(state: any) {
  return {
    categoryKeywordEntities: getCategoryKeywordEntities(state),
    categories: getCategories(state),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryKeywordsTable);

