import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import '../styles/Tracker.css';
import { CategoryEntity, CategoryKeywordEntity } from '../types';
import { IconButton, MenuItem, TextField } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

import { TrackerAnyPromiseThunkAction, TrackerDispatch } from '../models';
import { getCategories, getCategoryKeywordEntities } from '../selectors/categoryState';
import { addCategoryKeywordServerAndRedux, deleteCategoryKeywordServerAndRedux, updateCategoryKeywordServerAndRedux } from '../controllers/';
import { cloneDeep, isEmpty } from 'lodash';

interface CategoryKeywordsTableProps {
  categoryKeywordEntities: CategoryKeywordEntity[];
  categories: CategoryEntity[];
  onAddCategoryKeyword: (categoryKeywordEntity: CategoryKeywordEntity) => TrackerAnyPromiseThunkAction;
  onUpdateCategoryKeyword: (categoryKeywordEntity: CategoryKeywordEntity) => TrackerAnyPromiseThunkAction;
  onDeleteCategoryKeyword: (categoryKeywordEntity: CategoryKeywordEntity) => TrackerAnyPromiseThunkAction;
}

const CategoryKeywordsTable: React.FC<CategoryKeywordsTableProps> = (props: CategoryKeywordsTableProps) => {

  const [categoryKeywordById, setCategoryKeywordById] = React.useState<{ [categoryKeywordId: string]: CategoryKeywordEntity }>({}); // key is categoryKeywordId, value is CategoryKeywordEntity
  const [selectCategoryKeywordById, setSelectCategoryKeywordById] = React.useState<{ [categoryKeywordId: string]: string }>({}); // key is categoryKeywordId, value is keyword
  const [categoryIdByCategoryKeywordId, setCategoryIdByCategoryKeywordId] = React.useState<{ [categoryKeywordId: string]: string }>({}); // key is categoryKeywordId, value is categoryId

  const generateReactState = (): void => {
    const localCategoryKeywordById: { [categoryKeywordId: string]: CategoryKeywordEntity } = {};
    const localSelectedCategoryKeywordById: { [categoryKeywordId: string]: string } = {};
    const localCategoryIdByCategoryKeywordId: { [categoryKeywordId: string]: string } = {};
    for (const categoryKeywordEntity of props.categoryKeywordEntities) {
      localCategoryKeywordById[categoryKeywordEntity.id] = categoryKeywordEntity;
      localSelectedCategoryKeywordById[categoryKeywordEntity.id] = categoryKeywordEntity.keyword;
      localCategoryIdByCategoryKeywordId[categoryKeywordEntity.id] = categoryKeywordEntity.categoryId;
    }

    setCategoryKeywordById(localCategoryKeywordById);
    setSelectCategoryKeywordById(localSelectedCategoryKeywordById);
    setCategoryIdByCategoryKeywordId(localCategoryIdByCategoryKeywordId);
  }

  React.useEffect(() => {
    console.log('useEffect');
    generateReactState();
  }, [props.categoryKeywordEntities]);

  const updateCategoryKeywordFromInReactState = (categoryKeywordEntity: CategoryKeywordEntity): void => {
    const localCategoryKeywordById: { [categoryKeywordId: string]: CategoryKeywordEntity } = cloneDeep(categoryKeywordById);
    const localSelectedCategoryKeywordById: { [categoryKeywordId: string]: string } = cloneDeep(selectCategoryKeywordById);
    const localCategoryIdByCategoryKeywordId: { [categoryKeywordId: string]: string } = cloneDeep(categoryIdByCategoryKeywordId);

    localCategoryKeywordById[categoryKeywordEntity.id] = categoryKeywordEntity;
    localSelectedCategoryKeywordById[categoryKeywordEntity.id] = categoryKeywordEntity.keyword;
    localCategoryIdByCategoryKeywordId[categoryKeywordEntity.id] = categoryKeywordEntity.categoryId;

    setCategoryKeywordById(localCategoryKeywordById);
    setSelectCategoryKeywordById(localSelectedCategoryKeywordById);
    setCategoryIdByCategoryKeywordId(localCategoryIdByCategoryKeywordId);
  }

  const deleteCategoryKeywordInReactState = (categoryKeywordEntityId: string): void => {
    const localCategoryKeywordById: { [categoryKeywordId: string]: CategoryKeywordEntity } = cloneDeep(categoryKeywordById);
    const localSelectedCategoryKeywordById: { [categoryKeywordId: string]: string } = cloneDeep(selectCategoryKeywordById);
    const localCategoryIdByCategoryKeywordId: { [categoryKeywordId: string]: string } = cloneDeep(categoryIdByCategoryKeywordId);

    delete localCategoryKeywordById[categoryKeywordEntityId];
    delete localSelectedCategoryKeywordById[categoryKeywordEntityId];
    delete localCategoryIdByCategoryKeywordId[categoryKeywordEntityId];

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

    const originalKeyword = originalCategoryKeywordEntity.keyword;
    const originalCategoryId = originalCategoryKeywordEntity.categoryId;
    const originalCategory = getCategory(originalCategoryId);

    console.log('original values');
    console.log('originalCategoryKeywordEntity', originalCategoryKeywordEntity);
    console.log('originalKeyword', originalKeyword);
    console.log('originalCategoryId', originalCategoryId);
    console.log('originalCategory', originalCategory);

    // check for updated values
    const updatedCategoryKeywordEntityViaTextField: CategoryKeywordEntity = categoryKeywordById[categoryKeywordEntityId];
    const updatedKeywordViaSelect: string = selectCategoryKeywordById[categoryKeywordEntityId];
    const updatedCategoryId: string = categoryIdByCategoryKeywordId[categoryKeywordEntityId];

    console.log('updated values');
    console.log('updatedCategoryKeywordEntityViaTextField', updatedCategoryKeywordEntityViaTextField);
    console.log('updatedKeywordViaSelect', updatedKeywordViaSelect);
    console.log('updatedCategoryId', updatedCategoryId);

    console.log('SUMMARY');

    const categoryChanged: boolean = updatedCategoryId !== originalCategoryId;
    console.log('categoryChanged', categoryChanged);

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
          console.log('ERROR - keyword assigned to multiple categories');
          // HANDLE ERROR CASE - indicate an error to the user and restore old value
        } else {

          // keyword changed, new keyword already exists, combo of new keyword and category already exists. Delete this instance of categoryKeywordEntity
          deleteCategoryKeywordInReactState(categoryKeywordEntityId);
          props.onDeleteCategoryKeyword(originalCategoryKeywordEntity);

        }
      } else {
        // keyword is new
        console.log('keyword is new');

        // keyword is new. Clone selected keywordEntity (includes new keyword). Updated categoryId in case it changed.
        const updatedCategoryKeywordEntity: CategoryKeywordEntity = cloneDeep(updatedCategoryKeywordEntityViaTextField);
        updatedCategoryKeywordEntity.categoryId = updatedCategoryId;
        updateCategoryKeywordFromInReactState(updatedCategoryKeywordEntity);
        props.onUpdateCategoryKeyword(updatedCategoryKeywordEntity);

      }
    } else {
      console.log('keyword has not changed');

      if (!categoryChanged) {
        // neither keyword nor category has changed. Do nothing. (Save button should have been disabled).
        console.log('category unchanged, return');
        return;
      } {
        console.log('category has changed');
        const updatedCategoryKeywordEntity: CategoryKeywordEntity = cloneDeep(updatedCategoryKeywordEntityViaTextField);
        updatedCategoryKeywordEntity.categoryId = updatedCategoryId;
        updateCategoryKeywordFromInReactState(updatedCategoryKeywordEntity);
        props.onUpdateCategoryKeyword(updatedCategoryKeywordEntity);
      }
    }
  }

  const handleDeleteCategoryKeyword = (categoryKeywordEntityId: string): void => {
    const categoryKeywordEntity: CategoryKeywordEntity = categoryKeywordById[categoryKeywordEntityId];
    deleteCategoryKeywordInReactState(categoryKeywordEntityId);
    props.onDeleteCategoryKeyword(categoryKeywordEntity);
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

  const handleCategoryKeywordChange = (categoryKeywordEntity: CategoryKeywordEntity, keyword: string) => {
    const currentCategoryKeywordById: { [keyword: string]: CategoryKeywordEntity } = cloneDeep(categoryKeywordById);
    const currentCategoryByKeyword: CategoryKeywordEntity = currentCategoryKeywordById[categoryKeywordEntity.id];
    currentCategoryByKeyword.keyword = keyword;
    setCategoryKeywordById(currentCategoryKeywordById);
  };

  const handleCategoryChange = (categoryKeywordId: string, categoryId: string) => {
    const currentCategoryIdByCategoryKeywordId: { [categoryKeywordId: string]: string } = cloneDeep(categoryIdByCategoryKeywordId);
    currentCategoryIdByCategoryKeywordId[categoryKeywordId] = categoryId;
    setCategoryIdByCategoryKeywordId(currentCategoryIdByCategoryKeywordId);
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
          {Object.values(categoryKeywordById).map((categoryKeywordEntity: CategoryKeywordEntity) => (
            <div className="table-row" key={categoryKeywordEntity.id}>
              <div className="table-cell-keyword">
                <TextField
                  value={categoryKeywordById[categoryKeywordEntity.id].keyword}
                  onChange={(event) => handleCategoryKeywordChange(categoryKeywordEntity, event.target.value)}
                  style={{ marginLeft: '16px', minWidth: '400px' }}
                  helperText="Edit the keyword"
                />
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
                <IconButton
                  onClick={() => handleDeleteCategoryKeyword(categoryKeywordEntity.id) }>
                  <DeleteIcon />
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
