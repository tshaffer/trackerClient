import React from 'react';

import '../styles/Tracker.css';
import { Category, CategoryAssignmentRule } from '../types';
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

  // return (
  //   <Box sx={{ width: '100%' }}>
  //     <div className="table-container">
  //       <div className="table-header">
  //         <div className="table-row">
  //           <div className="table-cell"></div>
  //           <div className="table-cell">Category Name</div>
  //           <div className="table-cell">Number of Rules</div>
  //         </div>
  //       </div>
  //       <div className="catalog-table-body">
  //         {categories.map((category: Category) => (
  //           <React.Fragment key={category.id}>
  //             <div className="table-row">
  //               <div className="table-cell">
  //                 <IconButton onClick={() => handleToggle(category.id)}>
  //                   {openRows[category.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
  //                 </IconButton>
  //               </div>
  //               <div className="table-cell">{category.name}</div>
  //               <div className="table-cell">{getNumberOfRulesByCategory(category.id)}</div>
  //             </div>
  //             <div className="table-row">
  //               <div className="category-table-cell" style={{ paddingBottom: 0, paddingTop: 0 }}>
  //                 <Collapse in={openRows[category.id]} timeout="auto" unmountOnExit>
  //                   <Box margin={1}>
  //                     <div className="table-container">
  //                       <div className="table-header">
  //                         <div className="table-row">
  //                           <div className="category-category-table-cell">Pattern</div>
  //                         </div>
  //                       </div>
  //                       <div className="catalog-table-body">
  //                         {getRulesByCategory(category.id).map((rule, index) => (
  //                           <div className="table-row" key={index}>
  //                             <div className="category-category-table-cell">{rule.pattern}</div>
  //                           </div>
  //                         ))}
  //                       </div>
  //                     </div>
  //                   </Box>
  //                 </Collapse>
  //               </div>
  //             </div>
  //           </React.Fragment>
  //         ))}
  //       </div>
  //     </div>
  //   </Box>
  // );

  const renderTree = (nodes: any) => (
    <TreeItem
      key={nodes.id}
      itemId={nodes.id}
      label={
        <div className="table-row">
          <div className="table-cell">
            <IconButton onClick={() => handleToggle(nodes.id)}>
              {openRows[nodes.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </div>
          <div className="table-cell">{nodes.name}</div>
          <div className="table-cell">{getNumberOfRulesByCategory(nodes.id)}</div>
        </div>
      }
    >
      <div className="table-row">
        <div className="category-table-cell" style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={openRows[nodes.id]} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <div className="table-container">
                <div className="table-header">
                  <div className="table-row">
                    <div className="category-category-table-cell">Pattern</div>
                  </div>
                </div>
                <div className="catalog-table-body">
                  {getRulesByCategory(nodes.id).map((rule, index) => (
                    <div className="table-row" key={index}>
                      <div className="category-category-table-cell">{rule.pattern}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Box>
          </Collapse>
        </div>
      </div>
      {Array.isArray(nodes.children) ? nodes.children.map((node: any) => renderTree(node)) : null}
    </TreeItem>
  );

  const buildTree = () => {
    const map: any = {};
    const roots: any = [];
    categories.forEach((category) => {
      map[category.id] = { ...category, children: [] };
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

  const categoryTree = buildTree();

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
            {categoryTree.map((node: any) => renderTree(node))}
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
