import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import '../styles/Tracker.css';
import { CategoryEntity, CategoryKeywordEntity, EditCategoryRuleMode } from '../types';
import { Box, FormControl, FormControlLabel, IconButton, MenuItem, Radio, RadioGroup, Select, TextField } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { TrackerDispatch } from '../models';
import { getCategories, getCategoryKeywordEntities } from '../selectors/categoryState';
import { updateCategoryKeywordServerAndRedux } from '../controllers/';
import { cloneDeep, isEmpty } from 'lodash';

interface CategoryKeywordsTableProps {
  categoryKeywordEntities: CategoryKeywordEntity[];
  categories: CategoryEntity[];
  onUpdateCategoryKeyword: (categoryKeywordEntity: CategoryKeywordEntity) => any;
}

const CategoryKeywordsTable: React.FC<CategoryKeywordsTableProps> = (props: CategoryKeywordsTableProps) => {

  const [selectedOptionById, setSelectedOptionById] = React.useState<{ [categoryKeywordId: string]: EditCategoryRuleMode }>({}); // key is categoryKeywordId, value is EditCategoryRuleMode
  const [categoryKeywordById, setCategoryKeywordById] = React.useState<{ [categoryKeywordId: string]: CategoryKeywordEntity }>({}); // key is categoryKeywordId, value is CategoryKeywordEntity
  const [selectCategoryKeywordById, setSelectCategoryKeywordById] = React.useState<{ [categoryKeywordId: string]: string }>({}); // key is categoryKeywordId, value is keyword
  const [categoryIdByCategoryKeywordId, setCategoryIdByCategoryKeywordId] = React.useState<{ [categoryKeywordId: string]: string }>({}); // key is categoryKeywordId, value is categoryId

  React.useEffect(() => {
    
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

  }, [props.categoryKeywordEntities]);


  function handleSaveCategoryKeyword(): void {
    console.log('handleSaveCategoryKeyword');
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
    setSelectCategoryKeywordById(currentSelectCategoryKeywordById);}


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
          {props.categoryKeywordEntities.map((categoryKeywordEntity: CategoryKeywordEntity) => (
            <div className="table-row" key={categoryKeywordEntity.id}>
              <div className="table-cell-keyword">
                <Box display="flex" alignItems="center">
                  <FormControl component="fieldset">
                    <RadioGroup row value={selectedOptionById[categoryKeywordEntity.id]} onChange={(event) => handleOptionChange(categoryKeywordEntity.id, event)}>
                      <Box display="flex" alignItems="center">
                        <FormControlLabel value={EditCategoryRuleMode.Edit} control={<Radio />} label="Edit" />
                        <TextField
                          label="Edit"
                          value={categoryKeywordById[categoryKeywordEntity.id].keyword}
                          onChange={(event) => handleCategoryKeywordChange(categoryKeywordEntity, event.target.value)}
                          style={{ marginLeft: '16px' }}
                          disabled={selectedOptionById[categoryKeywordEntity.id] !== EditCategoryRuleMode.Edit}
                        />
                      </Box>
                      <Box display="flex" alignItems="center">
                        <FormControlLabel value={EditCategoryRuleMode.Choose} control={<Radio />} label="Choose" />
                        {(
                          <TextField
                            id="categoryKeyword"
                            select
                            label="Select"
                            value={selectCategoryKeywordById[categoryKeywordEntity.id]}
                            helperText="Select the keyword"
                            variant="standard"
                            onChange={(event) => handleCategoryKeywordOptionChange(categoryKeywordEntity.id, event.target.value)}
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
                <IconButton onClick={handleSaveCategoryKeyword}>
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
    onUpdateCategoryKeyword: updateCategoryKeywordServerAndRedux,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryKeywordsTable);
