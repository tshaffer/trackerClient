import React from 'react';
import { Box, Collapse, IconButton } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAppInitialized, getCategories, getCategoryAssignmentRules } from '../selectors';
import { Category, CategoryAssignmentRule, CategoryMenuItem, StringToCategoryMenuItemLUT } from '../types';
import { TrackerDispatch } from '../models';
import '../styles/Tracker.css';

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
  };

  const getNumberOfRulesByCategory = (categoryId: string): number => {
    return getRulesByCategory(categoryId).length;
  };

  const handleToggle = (id: string) => {
    setOpenRows((prevOpenRows) => ({
      ...prevOpenRows,
      [id]: !prevOpenRows[id],
    }));
  };

  const categories: Category[] = props.categories.sort((a, b) => a.name.localeCompare(b.name));

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
    );
  };

  const renderTree = (categoryMenuItem: CategoryMenuItem) => (
    <React.Fragment key={categoryMenuItem.id}>
      <tr className="table-row">
        <td className="table-cell">
          <IconButton onClick={() => handleToggle(categoryMenuItem.id)}>
            {openRows[categoryMenuItem.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </td>
        <td className="table-cell">{categoryMenuItem.name}</td>
        <td className="table-cell">{getNumberOfRulesByCategory(categoryMenuItem.id)}</td>
      </tr>
      <tr className="table-row">
        <td className="table-cell" colSpan={3}>
          <Collapse in={openRows[categoryMenuItem.id]} timeout="auto" unmountOnExit>
            <Box margin={1}>
              {renderPatternTable(categoryMenuItem)}
              {Array.isArray(categoryMenuItem.children) && categoryMenuItem.children.length > 0 && (
                <div className="catalog-table-body">
                  {categoryMenuItem.children.map((child) => renderTree(child))}
                </div>
              )}
            </Box>
          </Collapse>
        </td>
      </tr>
    </React.Fragment>
  );

  const buildCategoryTree = () => {
    const map: StringToCategoryMenuItemLUT = {};
    const roots: CategoryMenuItem[] = [];
    categories.forEach(category => {
      map[category.id] = { ...category, children: [], level: 0};
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
      <table className="table-container">
        <thead className="table-header">
          <tr className="table-row">
            <th className="table-cell"></th>
            <th className="table-cell">Category Name</th>
            <th className="table-cell">Number of Rules</th>
          </tr>
        </thead>
        <tbody className="catalog-table-body">
          {categoryTree.map((node: CategoryMenuItem) => renderTree(node))}
        </tbody>
      </table>
    </Box>
  );
};

function mapStateToProps(state: any) {
  return {
    appInitialized: getAppInitialized(state),
    categories: getCategories(state),
    categoryAssignmentRules: getCategoryAssignmentRules(state),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesTable);
