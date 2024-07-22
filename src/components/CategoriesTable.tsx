import React from 'react';

import '../styles/Tracker.css';
import { Category, CategoryAssignmentRule, CategoryMenuItem, StringToCategoryMenuItemLUT } from '../types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Box, Collapse, IconButton } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

import { TrackerDispatch } from '../models';
import { getAppInitialized, getCategories, getCategoryAssignmentRules } from '../selectors';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';


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

  const handleToggle = (id: string) => {
    setOpenRows((prevOpenRows) => ({
      ...prevOpenRows,
      [id]: !prevOpenRows[id],
    }));
  };

  const categories: Category[] = props.categories
    .map((category: Category) => category)
    .sort((a, b) => (a.name).localeCompare(b.name));

  const renderPatternTable = (categoryMenuItem: CategoryMenuItem): JSX.Element | null => {
    const categoryAssignmentRules: CategoryAssignmentRule[] = getRulesByCategory(categoryMenuItem.id);
    if (categoryAssignmentRules.length === 0) {
      return null;
    }
    return (
      <div className="table-container">
        <div className="table-header">
          <div className="table-row">
            <div className="category-table-cell">Pattern</div>
          </div>
        </div>
        <div className="catalog-table-body">
          {categoryAssignmentRules.map((rule: CategoryAssignmentRule, index: number) => (
            <div className="table-row" key={index}>
              <div className="category-table-cell">{rule.pattern}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderTree = (categoryMenuItem: CategoryMenuItem) => (
    <TreeItem
      key={categoryMenuItem.id}
      itemId={categoryMenuItem.id}
      label={
        <div className="table-row">
          <div className="table-cell">
            <IconButton onClick={() => handleToggle(categoryMenuItem.id)}>
              {openRows[categoryMenuItem.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </div>
          <div className="table-cell">{categoryMenuItem.name}</div>
          <div className="table-cell">{getNumberOfRulesByCategory(categoryMenuItem.id)}</div>
        </div>
      }
    >
      <div className="table-row">
        <div className="category-table-cell" style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={openRows[categoryMenuItem.id]} timeout="auto" unmountOnExit>
            <Box margin={1}>
              {renderPatternTable(categoryMenuItem)}
            </Box>
          </Collapse>
        </div>
      </div>
      {Array.isArray(categoryMenuItem.children) ? categoryMenuItem.children.map((node: any) => renderTree(node)) : null}
    </TreeItem>
  );

  const buildCategoryTree = () => {
    const map: StringToCategoryMenuItemLUT = {};
    const roots: CategoryMenuItem[] = [];
    categories.forEach(category => {
      map[category.id] = { ...category, children: [], level: (category.parentId !== '') ? map[category.parentId]?.level + 1 : 0 };
    });
    categories.forEach(category => {
      if (category.parentId === '') {
        roots.push(map[category.id]);
      } else {
        map[category.parentId].children.push(map[category.id]);
      }
    });
    return roots;
  };


  const categoryTree = buildCategoryTree();

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
          <SimpleTreeView
          >
            {categoryTree.map((node: CategoryMenuItem) => renderTree(node))}
          </SimpleTreeView>
        </div>
      </div>
    </Box>
  );

};


function mapStateToProps(state: any) {
  return {
    appInitialized: getAppInitialized(state),
    categories: getCategories(state),
    categoryAssignmentRules: getCategoryAssignmentRules(state),
  }
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesTable);
