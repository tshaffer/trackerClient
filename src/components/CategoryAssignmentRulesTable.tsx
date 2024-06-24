import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import '../styles/Tracker.css';
import { Category, CategoryAssignmentRule } from '../types';
import { Box, IconButton, MenuItem, TextField, Tooltip, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

import { TrackerAnyPromiseThunkAction, TrackerDispatch } from '../models';
import { getCategories, getCategoryAssignemntRules } from '../selectors/categoryState';
import { addCategoryAssignmentRuleServerAndRedux, deleteCategoryAssignmentRuleServerAndRedux, updateCategoryAssignmentRuleServerAndRedux } from '../controllers';
import { cloneDeep, isEmpty } from 'lodash';

interface CategoryAssignmentRulesTableProps {
  categoryAssignmentRules: CategoryAssignmentRule[];
  categories: Category[];
  onAddCategoryAssignmentRule: (categoryAssignmentRule: CategoryAssignmentRule) => TrackerAnyPromiseThunkAction;
  onUpdateCategoryAssignmentRule: (categoryAssignmentRule: CategoryAssignmentRule) => TrackerAnyPromiseThunkAction;
  onDeleteCategoryAssignmentRule: (categoryAssignmentRule: CategoryAssignmentRule) => TrackerAnyPromiseThunkAction;
}

const CategoryAssignmentRulesTable: React.FC<CategoryAssignmentRulesTableProps> = (props: CategoryAssignmentRulesTableProps) => {

  const [categoryKeywordById, setCategoryAssignmentRuleById] = React.useState<{ [categoryKeywordId: string]: CategoryAssignmentRule }>({}); // key is categoryKeywordId, value is CategoryAssignmentRule
  const [selectCategoryAssignmentRuleById, setSelectCategoryAssignmentRuleById] = React.useState<{ [categoryKeywordId: string]: string }>({}); // key is categoryKeywordId, value is keyword
  const [categoryIdByCategoryAssignmentRuleId, setCategoryIdByCategoryAssignmentRuleId] = React.useState<{ [categoryKeywordId: string]: string }>({}); // key is categoryKeywordId, value is categoryId

  const generateReactState = (): void => {
    const localCategoryAssignmentRuleById: { [categoryKeywordId: string]: CategoryAssignmentRule } = {};
    const localSelectedCategoryAssignmentRuleById: { [categoryKeywordId: string]: string } = {};
    const localCategoryIdByCategoryAssignmentRuleId: { [categoryKeywordId: string]: string } = {};
    for (const categoryAssignmentRule of props.categoryAssignmentRules) {
      localCategoryAssignmentRuleById[categoryAssignmentRule.id] = categoryAssignmentRule;
      localSelectedCategoryAssignmentRuleById[categoryAssignmentRule.id] = categoryAssignmentRule.pattern;
      localCategoryIdByCategoryAssignmentRuleId[categoryAssignmentRule.id] = categoryAssignmentRule.categoryId;
    }

    setCategoryAssignmentRuleById(localCategoryAssignmentRuleById);
    setSelectCategoryAssignmentRuleById(localSelectedCategoryAssignmentRuleById);
    setCategoryIdByCategoryAssignmentRuleId(localCategoryIdByCategoryAssignmentRuleId);
  }

  React.useEffect(() => {
    console.log('useEffect');
    generateReactState();
  }, [props.categoryAssignmentRules]);

  const updateCategoryAssignmentRuleFromInReactState = (categoryAssignmentRule: CategoryAssignmentRule): void => {
    const localCategoryAssignmentRuleById: { [categoryKeywordId: string]: CategoryAssignmentRule } = cloneDeep(categoryKeywordById);
    const localSelectedCategoryAssignmentRuleById: { [categoryKeywordId: string]: string } = cloneDeep(selectCategoryAssignmentRuleById);
    const localCategoryIdByCategoryAssignmentRuleId: { [categoryKeywordId: string]: string } = cloneDeep(categoryIdByCategoryAssignmentRuleId);

    localCategoryAssignmentRuleById[categoryAssignmentRule.id] = categoryAssignmentRule;
    localSelectedCategoryAssignmentRuleById[categoryAssignmentRule.id] = categoryAssignmentRule.pattern;
    localCategoryIdByCategoryAssignmentRuleId[categoryAssignmentRule.id] = categoryAssignmentRule.categoryId;

    setCategoryAssignmentRuleById(localCategoryAssignmentRuleById);
    setSelectCategoryAssignmentRuleById(localSelectedCategoryAssignmentRuleById);
    setCategoryIdByCategoryAssignmentRuleId(localCategoryIdByCategoryAssignmentRuleId);
  }

  const deleteCategoryAssignmentRuleInReactState = (categoryAssignmentRuleId: string): void => {
    const localCategoryAssignmentRuleById: { [categoryKeywordId: string]: CategoryAssignmentRule } = cloneDeep(categoryKeywordById);
    const localSelectedCategoryAssignmentRuleById: { [categoryKeywordId: string]: string } = cloneDeep(selectCategoryAssignmentRuleById);
    const localCategoryIdByCategoryAssignmentRuleId: { [categoryKeywordId: string]: string } = cloneDeep(categoryIdByCategoryAssignmentRuleId);

    delete localCategoryAssignmentRuleById[categoryAssignmentRuleId];
    delete localSelectedCategoryAssignmentRuleById[categoryAssignmentRuleId];
    delete localCategoryIdByCategoryAssignmentRuleId[categoryAssignmentRuleId];

    setCategoryAssignmentRuleById(localCategoryAssignmentRuleById);
    setSelectCategoryAssignmentRuleById(localSelectedCategoryAssignmentRuleById);
    setCategoryIdByCategoryAssignmentRuleId(localCategoryIdByCategoryAssignmentRuleId);
  }

  const updatedKeywordCategoryCombinationExistsInProps = (keyword: string, categoryId: string): boolean => {
    return props.categoryAssignmentRules.some((categoryAssignmentRule: CategoryAssignmentRule) => categoryAssignmentRule.pattern === keyword && categoryAssignmentRule.categoryId === categoryId);
  }

  function handleSaveCategoryAssignmentRule(categoryAssignmentRuleId: string): void {
    console.log('handleSaveCategoryAssignmentRule');

    // original values
    const originalCategoryAssignmentRule: CategoryAssignmentRule = props.categoryAssignmentRules.find((categoryAssignmentRule: CategoryAssignmentRule) => categoryAssignmentRule.id === categoryAssignmentRuleId) as CategoryAssignmentRule;

    const originalKeyword = originalCategoryAssignmentRule.pattern;
    const originalCategoryId = originalCategoryAssignmentRule.categoryId;
    const originalCategory = getCategory(originalCategoryId);

    console.log('original values');
    console.log('originalCategoryAssignmentRule', originalCategoryAssignmentRule);
    console.log('originalKeyword', originalKeyword);
    console.log('originalCategoryId', originalCategoryId);
    console.log('originalCategory', originalCategory);

    // check for updated values
    const updatedCategoryAssignmentRuleViaTextField: CategoryAssignmentRule = categoryKeywordById[categoryAssignmentRuleId];
    const updatedKeywordViaSelect: string = selectCategoryAssignmentRuleById[categoryAssignmentRuleId];
    const updatedCategoryId: string = categoryIdByCategoryAssignmentRuleId[categoryAssignmentRuleId];

    console.log('updated values');
    console.log('updatedCategoryAssignmentRuleViaTextField', updatedCategoryAssignmentRuleViaTextField);
    console.log('updatedKeywordViaSelect', updatedKeywordViaSelect);
    console.log('updatedCategoryId', updatedCategoryId);

    console.log('SUMMARY');

    const categoryChanged: boolean = updatedCategoryId !== originalCategoryId;
    console.log('categoryChanged', categoryChanged);

    if (updatedCategoryAssignmentRuleViaTextField.pattern !== originalKeyword) {
      console.log('keyword changed');
      const keywordAlreadyExists: boolean = props.categoryAssignmentRules.some((categoryAssignmentRule: CategoryAssignmentRule) => categoryAssignmentRule.pattern === updatedCategoryAssignmentRuleViaTextField.pattern);

      if (keywordAlreadyExists) {
        // keyword has changed, but the updated one already exists
        console.log('keyword already exists');

        const comboAlreadyExists: boolean = updatedKeywordCategoryCombinationExistsInProps(updatedCategoryAssignmentRuleViaTextField.pattern, updatedCategoryId);
        console.log('comboAlreadyExists', comboAlreadyExists);

        if (!comboAlreadyExists) {
          // keyword changed, new keyword already exists, combo of new keyword and category does not exist
          // NO - User cannot assign a keyword to a category if the keyword already exists and is assigned to a different category
          console.log('ERROR - keyword assigned to multiple categories');
          // HANDLE ERROR CASE - indicate an error to the user and restore old value
        } else {

          // keyword changed, new keyword already exists, combo of new keyword and category already exists. Delete this instance of categoryAssignmentRule
          deleteCategoryAssignmentRuleInReactState(categoryAssignmentRuleId);
          props.onDeleteCategoryAssignmentRule(originalCategoryAssignmentRule);

        }
      } else {
        // keyword is new
        console.log('keyword is new');

        // keyword is new. Clone selected CategoryAssignmentRule (includes new pattern). Updated categoryId in case it changed.
        const updatedCategoryAssignmentRule: CategoryAssignmentRule = cloneDeep(updatedCategoryAssignmentRuleViaTextField);
        updatedCategoryAssignmentRule.categoryId = updatedCategoryId;
        updateCategoryAssignmentRuleFromInReactState(updatedCategoryAssignmentRule);
        props.onUpdateCategoryAssignmentRule(updatedCategoryAssignmentRule);

      }
    } else {
      console.log('keyword has not changed');

      if (!categoryChanged) {
        // neither keyword nor category has changed. Do nothing. (Save button should have been disabled).
        console.log('category unchanged, return');
        return;
      } {
        console.log('category has changed');
        const updatedCategoryAssignmentRule: CategoryAssignmentRule = cloneDeep(updatedCategoryAssignmentRuleViaTextField);
        updatedCategoryAssignmentRule.categoryId = updatedCategoryId;
        updateCategoryAssignmentRuleFromInReactState(updatedCategoryAssignmentRule);
        props.onUpdateCategoryAssignmentRule(updatedCategoryAssignmentRule);
      }
    }
  }

  const handleDeleteCategoryAssignmentRule = (categoryAssignmentRuleId: string): void => {
    const categoryAssignmentRule: CategoryAssignmentRule = categoryKeywordById[categoryAssignmentRuleId];
    deleteCategoryAssignmentRuleInReactState(categoryAssignmentRuleId);
    props.onDeleteCategoryAssignmentRule(categoryAssignmentRule);
  }

  const getCategory = (categoryId: string): Category => {
    return props.categories.find((category: Category) => category.id === categoryId) as Category;
  };

  const sortCategories = (categories: Category[]): Category[] => {
    return categories.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  };

  const handleCategoryAssignmentRuleChange = (categoryAssignmentRule: CategoryAssignmentRule, keyword: string) => {
    const currentCategoryAssignmentRuleById: { [keyword: string]: CategoryAssignmentRule } = cloneDeep(categoryKeywordById);
    const currentCategoryByKeyword: CategoryAssignmentRule = currentCategoryAssignmentRuleById[categoryAssignmentRule.id];
    currentCategoryByKeyword.pattern = keyword;
    setCategoryAssignmentRuleById(currentCategoryAssignmentRuleById);
  };

  const handleCategoryChange = (categoryKeywordId: string, categoryId: string) => {
    const currentCategoryIdByCategoryAssignmentRuleId: { [categoryKeywordId: string]: string } = cloneDeep(categoryIdByCategoryAssignmentRuleId);
    currentCategoryIdByCategoryAssignmentRuleId[categoryKeywordId] = categoryId;
    setCategoryIdByCategoryAssignmentRuleId(currentCategoryIdByCategoryAssignmentRuleId);
  }

  let alphabetizedCategories: Category[] = cloneDeep(props.categories);
  alphabetizedCategories = sortCategories(alphabetizedCategories);

  if (props.categoryAssignmentRules.length === 0) {
    return <></>;
  }

  if (isEmpty(categoryKeywordById)) {
    return <></>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" style={{ marginBottom: '8px' }}>Aliases</Typography>
      <div className="table-container">
        <div className="table-header">
          <div className="table-row">
            <div className="table-cell-keyword">Pattern</div>
            <div className="table-cell-keyword">Category</div>
            <div className="table-cell"></div>
          </div>
        </div>
        <div className="category-keywords-table-body">
          {Object.values(categoryKeywordById).map((categoryAssignmentRule: CategoryAssignmentRule) => (
            <div className="table-row" key={categoryAssignmentRule.id}>
              <div className="table-cell-keyword">
                <TextField
                  value={categoryKeywordById[categoryAssignmentRule.id].pattern}
                  onChange={(event) => handleCategoryAssignmentRuleChange(categoryAssignmentRule, event.target.value)}
                  style={{ minWidth: '400px' }}
                  helperText="Edit the keyword"
                />
              </div>
              <div className="table-cell-keyword">
                <TextField
                  id="category"
                  select
                  value={categoryIdByCategoryAssignmentRuleId[categoryAssignmentRule.id]}
                  helperText="Select the associated category"
                  variant="standard"
                  onChange={(event) => handleCategoryChange(categoryAssignmentRule.id, event.target.value)}
                >
                  {alphabetizedCategories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div className="table-cell-keyword" style={{ marginLeft: '32px' }}>
                <Tooltip title="Save" arrow>
                  <IconButton onClick={() => handleSaveCategoryAssignmentRule(categoryAssignmentRule.id)}>
                    <SaveIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete" arrow>
                  <IconButton onClick={() => handleDeleteCategoryAssignmentRule(categoryAssignmentRule.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Box>
  );
}

function mapStateToProps(state: any) {
  return {
    categoryAssignmentRules: getCategoryAssignemntRules(state),
    categories: getCategories(state),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
    onAddCategoryAssignmentRule: addCategoryAssignmentRuleServerAndRedux,
    onUpdateCategoryAssignmentRule: updateCategoryAssignmentRuleServerAndRedux,
    onDeleteCategoryAssignmentRule: deleteCategoryAssignmentRuleServerAndRedux,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryAssignmentRulesTable);
