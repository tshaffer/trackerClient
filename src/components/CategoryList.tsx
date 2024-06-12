import React from 'react';
import { connect } from 'react-redux';

import { getCategories } from '../selectors/categoryState';
import { CategoryEntity } from '../types';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

interface CategoryListProps {
  categoryEntities: CategoryEntity[];
}

const CategoryList: React.FC<CategoryListProps> = (props: CategoryListProps) => {

  const categoryEntities: CategoryEntity[] = props.categoryEntities
  .map((categoryEntity: CategoryEntity) => categoryEntity)
  .sort((a, b) => (a.keyword).localeCompare(b.keyword));

  return (
    <div>
      <List>
        {categoryEntities.map((categoryEntity: CategoryEntity) => {
          return (
            <ListItem key={categoryEntity.id}>
              <ListItemText primary={categoryEntity.keyword} />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}

function mapStateToProps(state: any) {
  return {
    categoryEntities: getCategories(state),
  };
}

export default connect(mapStateToProps)(CategoryList);

