import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import '../styles/Tracker.css';
import { CategoryEntity, CategoryKeywordEntity, EditCategoryRuleMode } from '../types';
import { Box, FormControl, FormControlLabel, IconButton, MenuItem, Radio, RadioGroup, Select, TextField } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { TrackerAnyPromiseThunkAction, TrackerDispatch } from '../models';
import { getCategories, getCategoryKeywordEntities } from '../selectors/categoryState';
import { addCategoryKeywordServerAndRedux, addCategoryServerAndRedux, deleteCategoryKeywordServerAndRedux, updateCategoryKeywordServerAndRedux } from '../controllers/';
import { cloneDeep, isEmpty } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

interface CategoryKeywordsTableProps {
  categoryKeywordEntities: CategoryKeywordEntity[];
  categories: CategoryEntity[];
  onAddCategoryKeyword: (categoryKeywordEntity: CategoryKeywordEntity) => TrackerAnyPromiseThunkAction;
  onUpdateCategoryKeyword: (categoryKeywordEntity: CategoryKeywordEntity) => TrackerAnyPromiseThunkAction;
  onDeleteCategoryKeyword: (categoryKeywordEntity: CategoryKeywordEntity) => TrackerAnyPromiseThunkAction;
}

const CategoryKeywordsTable: React.FC<CategoryKeywordsTableProps> = (props: CategoryKeywordsTableProps) => {

  const [selectedOptionById, setSelectedOptionById] = React.useState<{ [categoryKeywordId: string]: EditCategoryRuleMode }>({}); // key is categoryKeywordId, value is EditCategoryRuleMode
  const [categoryKeywordById, setCategoryKeywordById] = React.useState<{ [categoryKeywordId: string]: CategoryKeywordEntity }>({}); // key is categoryKeywordId, value is CategoryKeywordEntity
  const [selectCategoryKeywordById, setSelectCategoryKeywordById] = React.useState<{ [categoryKeywordId: string]: string }>({}); // key is categoryKeywordId, value is keyword
  const [categoryIdByCategoryKeywordId, setCategoryIdByCategoryKeywordId] = React.useState<{ [categoryKeywordId: string]: string }>({}); // key is categoryKeywordId, value is categoryId

  const generateReactState = (): void => {
    const localSelectedOptionsById: { [categoryKeywordId: string]: EditCategoryRuleMode } = {};
    const localCategoryKeywordById: { [categoryKeywordId: string]: CategoryKeywordEntity } = {};
    const localSelectedCategoryKeywordById: { [categoryKeywordId: string]: string } = {};
    const localCategoryIdByCategoryKeywordId: { [categoryKeywordId: string]: string } = {};
    for (const categoryKeywordEntity of props.categoryKeywordEntities) {
      localSelectedOptionsById[categoryKeywordEntity.id] = EditCategoryRuleMode.Edit;
      localCategoryKeywordById[categoryKeywordEntity.id] = categoryKeywordEntity;
      localSelectedCategoryKeywordById[categoryKeywordEntity.id] = categoryKeywordEntity.keyword;
      localCategoryIdByCategoryKeywordId[categoryKeywordEntity.id] = categoryKeywordEntity.categoryId;
    }

    setSelectedOptionById(localSelectedOptionsById);
    setCategoryKeywordById(localCategoryKeywordById);
    setSelectCategoryKeywordById(localSelectedCategoryKeywordById);
    setCategoryIdByCategoryKeywordId(localCategoryIdByCategoryKeywordId);
  }

  React.useEffect(() => {
    console.log('useEffect');
    generateReactState();
  }, [props.categoryKeywordEntities]);

  const deleteCategoryKeywordFromReactState = (categoryKeywordEntityId: string): void => {
    const localSelectedOptionsById: { [categoryKeywordId: string]: EditCategoryRuleMode } = cloneDeep(selectedOptionById);
    const localCategoryKeywordById: { [categoryKeywordId: string]: CategoryKeywordEntity } = cloneDeep(categoryKeywordById);
    const localSelectedCategoryKeywordById: { [categoryKeywordId: string]: string } = cloneDeep(selectCategoryKeywordById);
    const localCategoryIdByCategoryKeywordId: { [categoryKeywordId: string]: string } = cloneDeep(categoryIdByCategoryKeywordId);

    delete localSelectedOptionsById[categoryKeywordEntityId];
    delete localCategoryKeywordById[categoryKeywordEntityId];
    delete localSelectedCategoryKeywordById[categoryKeywordEntityId];
    delete localCategoryIdByCategoryKeywordId[categoryKeywordEntityId];

    setSelectedOptionById(localSelectedOptionsById);
    setCategoryKeywordById(localCategoryKeywordById);
    setSelectCategoryKeywordById(localSelectedCategoryKeywordById);
    setCategoryIdByCategoryKeywordId(localCategoryIdByCategoryKeywordId);
  }

  const updatedKeywordCategoryCombinationExistsInProps = (keyword: string, categoryId: string): boolean => {
    return props.categoryKeywordEntities.some((categoryKeywordEntity: CategoryKeywordEntity) => categoryKeywordEntity.keyword === keyword && categoryKeywordEntity.categoryId === categoryId);
  }

  function handleSaveCategoryKeyword(categoryKeywordEntityId: string): void {
    console.log('handleSaveCategoryKeyword');

    // original values
    const originalCategoryKeywordEntity: CategoryKeywordEntity = props.categoryKeywordEntities.find((categoryKeywordEntity: CategoryKeywordEntity) => categoryKeywordEntity.id === categoryKeywordEntityId) as CategoryKeywordEntity;
    const clonedCategoryKeywordEntity: CategoryKeywordEntity = cloneDeep(originalCategoryKeywordEntity);

    const originalKeyword = originalCategoryKeywordEntity.keyword;
    const originalCategoryId = originalCategoryKeywordEntity.categoryId;
    const originalCategory = getCategory(originalCategoryId);

    console.log('original values');
    const selectedEditCategoryRuleMode: EditCategoryRuleMode = selectedOptionById[categoryKeywordEntityId];
    console.log('selectedEditCategoryRuleMode', selectedEditCategoryRuleMode);

    console.log('original values');
    console.log('originalCategoryKeywordEntity', originalCategoryKeywordEntity);
    console.log('originalKeyword', originalKeyword);
    console.log('originalCategoryId', originalCategoryId);
    console.log('originalCategory', originalCategory);

    // check for updated values
    const updatedCategoryKeywordEntityViaTextField: CategoryKeywordEntity = categoryKeywordById[categoryKeywordEntityId];
    const updatedKeywordViaSelect = selectCategoryKeywordById[categoryKeywordEntityId];
    const updatedCategoryId: string = categoryIdByCategoryKeywordId[categoryKeywordEntityId];

    console.log('updated values');
    console.log('updatedCategoryKeywordEntityViaTextField', updatedCategoryKeywordEntityViaTextField);
    console.log('updatedKeywordViaSelect', updatedKeywordViaSelect);
    console.log('updatedCategoryId', updatedCategoryId);

    console.log('SUMMARY');

    const categoryChanged: boolean = updatedCategoryId !== originalCategoryId;
    console.log('categoryChanged', categoryChanged);

    if (selectedEditCategoryRuleMode === EditCategoryRuleMode.Edit) {
      if (updatedCategoryKeywordEntityViaTextField.keyword !== originalKeyword) {
        console.log('keyword changed');
        const keywordAlreadyExists: boolean = props.categoryKeywordEntities.some((categoryKeywordEntity: CategoryKeywordEntity) => categoryKeywordEntity.keyword === updatedCategoryKeywordEntityViaTextField.keyword);
        if (keywordAlreadyExists) {

          // keyword has changed, but the updated one already exists
          console.log('keyword already exists');


          const comboAlreadyExists: boolean = updatedKeywordCategoryCombinationExistsInProps(updatedCategoryKeywordEntityViaTextField.keyword, updatedCategoryId);
          console.log('comboAlreadyExists', comboAlreadyExists);

          if (!comboAlreadyExists) {
            // keyword changed, new keyword already exists, combo of new keyword and category does not exist
            // NO - User cannot assign a keyword to a category if the keyword already exists and is assigned to a different category
            console.log('combo does not exist');
            // HANDLE ERROR CASE - indicate an error to the user and restore old value
          } else {
            // keyword changed, new keyword already exists, combo of new keyword and category already exists. Delete this instance
            deleteCategoryKeywordFromReactState(categoryKeywordEntityId);
            props.onDeleteCategoryKeyword(originalCategoryKeywordEntity);
          }
        } else {
          // keyword is new
          console.log('keyword is new');

          const newCategoryKeywordEntity: CategoryKeywordEntity = {
            ...updatedCategoryKeywordEntityViaTextField,
            id: uuidv4(),
            categoryId: updatedCategoryId,
          };
          props.onAddCategoryKeyword(newCategoryKeywordEntity);
          props.onDeleteCategoryKeyword(originalCategoryKeywordEntity);

          // update react state
          // console.log('regenerateReactState');
          // generateReactState();
        }
      } else {
        console.log('keyword has not changed');
      }
    } else {
      console.log('User selected existing keyword');

    }


  }

  const getCategory = (categoryId: string): CategoryEntity => {
    return props.categories.find((category: CategoryEntity) => category.id === categoryId) as CategoryEntity;
  };

  const sortCategoryEntities = (categoryEntities: CategoryEntity[]): CategoryEntity[] => {
    return categoryEntities.sort((a, b) => {
      if (a.keyword < b.keyword) {
        return -1;
      }
      if (a.keyword > b.keyword) {
        return 1;
      }
      return 0;
    });
  };

  const handleOptionChange = (id: string, event: any) => {
    const currentSelectedOptionById: { [keyword: string]: EditCategoryRuleMode } = cloneDeep(selectedOptionById);
    currentSelectedOptionById[id] = event.target.value;
    setSelectedOptionById(currentSelectedOptionById);
  };

  const handleCategoryKeywordChange = (categoryKeywordEntity: CategoryKeywordEntity, keyword: string) => {
    const currentCategoryKeywordById: { [keyword: string]: CategoryKeywordEntity } = cloneDeep(categoryKeywordById);
    const currentCategoryByKeyword: CategoryKeywordEntity = currentCategoryKeywordById[categoryKeywordEntity.id];
    currentCategoryByKeyword.keyword = keyword;
    setCategoryKeywordById(currentCategoryKeywordById);
  };

  function handleCategoryKeywordOptionChange(selectedCategoryKeywordEntityId: string, keyword: string): void {
    console.log('handleCategoryKeywordOptionChange', selectedCategoryKeywordEntityId, keyword);
    const currentSelectCategoryKeywordById: { [keyword: string]: string } = cloneDeep(selectCategoryKeywordById);
    currentSelectCategoryKeywordById[selectedCategoryKeywordEntityId] = keyword;
    setSelectCategoryKeywordById(currentSelectCategoryKeywordById);
  }


  const handleCategoryChange = (categoryKeywordId: string, categoryId: string) => {
    const currentCategoryIdByCategoryKeywordId: { [categoryKeywordId: string]: string } = cloneDeep(categoryIdByCategoryKeywordId);
    currentCategoryIdByCategoryKeywordId[categoryKeywordId] = categoryId;
    setCategoryIdByCategoryKeywordId(currentCategoryIdByCategoryKeywordId);
  }

  function handleBlur(event: any): void {
    console.log('handleBlur', event);
    console.log(event.target.value);
  }

  function handleBlurCapture(event: any): void {
    console.log('handleBlurCapture', event);
    console.log(event.target.value);
  }

  let alphabetizedCategoryEntities: CategoryEntity[] = cloneDeep(props.categories);
  alphabetizedCategoryEntities = sortCategoryEntities(alphabetizedCategoryEntities);

  if (props.categoryKeywordEntities.length === 0) {
    return <></>;
  }

  if (isEmpty(categoryKeywordById)) {
    return <></>;
  }

  return (
    <React.Fragment>
      <div className="table-container">
        <div className="table-header">
          <div className="table-row">
            <div className="table-cell-keyword">Keyword</div>
            <div className="table-cell-keyword">Category</div>
            <div className="table-cell"></div>
          </div>
        </div>
        <div className="table-body">
          {props.categoryKeywordEntities.map((categoryKeywordEntity: CategoryKeywordEntity) => (
            <div className="table-row" key={categoryKeywordEntity.id}>
              <div className="table-cell-keyword">
                <Box display="flex" alignItems="center">
                  <FormControl component="fieldset">
                    <RadioGroup row value={selectedOptionById[categoryKeywordEntity.id]} onChange={(event) => handleOptionChange(categoryKeywordEntity.id, event)}>
                      <Box display="flex" alignItems="center">
                        <FormControlLabel value={EditCategoryRuleMode.Edit} control={<Radio />} label="Edit" />
                        <TextField
                          value={categoryKeywordById[categoryKeywordEntity.id].keyword}
                          onChange={(event) => handleCategoryKeywordChange(categoryKeywordEntity, event.target.value)}
                          onBlur={(event) => handleBlur(event)}
                          onBlurCapture={(event) => handleBlurCapture(event)}
                          style={{ marginLeft: '16px', minWidth: '400px' }}
                          helperText="Edit the keyword"
                          disabled={selectedOptionById[categoryKeywordEntity.id] !== EditCategoryRuleMode.Edit}
                        />
                      </Box>
                      <Box display="flex" alignItems="center" sx={{ marginTop: '12px' }}>
                        <FormControlLabel value={EditCategoryRuleMode.Choose} control={<Radio />} label="Choose" />
                        {(
                          <TextField
                            id="categoryKeyword"
                            select
                            style={{ minWidth: '400px' }}
                            value={selectCategoryKeywordById[categoryKeywordEntity.id]}
                            variant="standard"
                            onChange={(event) => handleCategoryKeywordOptionChange(categoryKeywordEntity.id, event.target.value)}
                            helperText="Select the keyword from the list"
                            disabled={selectedOptionById[categoryKeywordEntity.id] !== EditCategoryRuleMode.Choose}
                          >
                            {props.categoryKeywordEntities.map((categoryKeywordEntity: CategoryKeywordEntity) => (
                              <MenuItem key={categoryKeywordEntity.id} value={categoryKeywordEntity.keyword}>
                                {categoryKeywordEntity.keyword}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      </Box>
                    </RadioGroup>
                  </FormControl>
                </Box>
              </div>
              <div className="table-cell-keyword">
                <TextField
                  id="category"
                  select
                  value={categoryIdByCategoryKeywordId[categoryKeywordEntity.id]}
                  helperText="Select the associated category"
                  variant="standard"
                  onChange={(event) => handleCategoryChange(categoryKeywordEntity.id, event.target.value)}
                >
                  {alphabetizedCategoryEntities.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.keyword}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div className="table-cell-keyword">
                <IconButton onClick={() => handleSaveCategoryKeyword(categoryKeywordEntity.id)}>
                  <SaveIcon />
                </IconButton>
              </div>
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
    onAddCategoryKeyword: addCategoryKeywordServerAndRedux,
    onUpdateCategoryKeyword: updateCategoryKeywordServerAndRedux,
    onDeleteCategoryKeyword: deleteCategoryKeywordServerAndRedux,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryKeywordsTable);
