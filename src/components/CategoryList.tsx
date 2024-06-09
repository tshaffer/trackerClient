import React from 'react';
import { connect } from 'react-redux';

import { getCategories } from '../selectors/categoryState';
import { CategoryEntity } from '../types';
import { List, ListItem, ListItemText } from '@mui/material';

interface CategoryListProps {
  categoryEntities: CategoryEntity[];
}

const CategoryList: React.FC<CategoryListProps> = (props: CategoryListProps) => {
  return (
    <List>
      {props.categoryEntities.map((categoryEntity: CategoryEntity) => {
        return (
          <ListItem key={categoryEntity.id}>
            <ListItemText primary={categoryEntity.keyword} />
          </ListItem>
        );
      })}
    </List>
  );
}

function mapStateToProps(state: any) {
  return {
    categoryEntities: getCategories(state),
  };
}

export default connect(mapStateToProps)(CategoryList);

