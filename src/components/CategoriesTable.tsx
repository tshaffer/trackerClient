import React from 'react';
import { Box, Collapse, IconButton } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAppInitialized, getCategories, getCategoryAssignmentRules, getCategoryByName } from '../selectors';
import { Category, CategoryAssignmentRule, CategoryMenuItem, StringToCategoryMenuItemLUT } from '../types';
import { TrackerDispatch } from '../models';
import '../styles/Tracker.css';
import { cloneDeep, isNil } from 'lodash';

interface CategoriesTableProps {
  appInitialized: boolean;
  categories: Category[];
  categoryAssignmentRules: CategoryAssignmentRule[];
  ignoreCategory: Category | undefined;
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

  let trimmedCategories = cloneDeep(props.categories);
  if (!isNil(props.ignoreCategory)) {
    trimmedCategories = props.categories.filter(category => category.id !== props.ignoreCategory!.id)
  }
  const categories: Category[] = trimmedCategories.sort((a, b) => a.name.localeCompare(b.name));

  const renderPatternTable = (categoryMenuItem: CategoryMenuItem): JSX.Element | null => {
    const categoryAssignmentRules: CategoryAssignmentRule[] = getRulesByCategory(categoryMenuItem.id);
    if (categoryAssignmentRules.length === 0) {
      return null;
    }
    return (
      <div className="chatgpt-category-table-container">
        <div className="chatgpt-category-table-header">
          <div className="chatgpt-category-table-row">
            <div className="chatgpt-category-table-cell">Pattern</div>
          </div>
        </div>
        <div className="chatgpt-category-table-body">
          {categoryAssignmentRules.map((rule: CategoryAssignmentRule, index: number) => (
            <div className="chatgpt-category-table-row" key={index}>
              <div className="chatgpt-category-table-cell">{rule.pattern}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTree = (categoryMenuItem: CategoryMenuItem) => (
    <React.Fragment key={categoryMenuItem.id}>
      <tr className="chatgpt-category-table-row">
        <td className="chatgpt-category-table-cell">
          <IconButton onClick={() => handleToggle(categoryMenuItem.id)}>
            {openRows[categoryMenuItem.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </td>
        <td className="chatgpt-category-table-cell">{categoryMenuItem.name}</td>
        <td className="chatgpt-category-table-cell">{categoryMenuItem.transactionsRequired.toString()}</td>
        <td className="chatgpt-category-table-cell">{getNumberOfRulesByCategory(categoryMenuItem.id)}</td>
      </tr>
      <tr className="chatgpt-category-table-row">
        <td className="chatgpt-category-table-cell" colSpan={3}>
          <Collapse in={openRows[categoryMenuItem.id]} timeout="auto" unmountOnExit>
            <Box margin={1}>
              {renderPatternTable(categoryMenuItem)}
              {Array.isArray(categoryMenuItem.children) && categoryMenuItem.children.length > 0 && (
                <div className="chatgpt-category-table-body">
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
      <table className="chatgpt-category-table-container">
        <thead className="chatgpt-category-table-header">
          <tr className="chatgpt-category-table-row">
            <th className="chatgpt-category-table-cell"></th>
            <th className="chatgpt-category-table-cell">Category Name</th>
            <th className="chatgpt-category-table-cell">Transactions Required?</th>
            <th className="chatgpt-category-table-cell">Number of Rules</th>
          </tr>
        </thead>
        <tbody className="chatgpt-category-table-body">
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
    ignoreCategory: getCategoryByName(state, 'Ignore'),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesTable);
