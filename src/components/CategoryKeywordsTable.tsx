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

  const [selectedOption, setSelectedOption] = React.useState<EditCategoryRuleMode>(EditCategoryRuleMode.Edit);
  
  const [textFieldValue, setTextFieldValue] = React.useState('');
  const [selectedValue, setSelectedValue] = React.useState('');
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>('');

  const [selectedOptionById, setSelectedOptionById] = React.useState<{ [keyword: string]: EditCategoryRuleMode }>({}); // key is categoryKeywordId
  const [categoryKeywordById, setCategoryKeywordById] = React.useState<{ [keyword: string]: CategoryKeywordEntity }>({}); // key is categoryKeywordId
  const [selectCategoryKeywordById, setSelectCategoryKeywordById] = React.useState<{ [keyword: string]: CategoryKeywordEntity }>({}); // key is categoryKeywordId 
  
  React.useEffect(() => {
    const localSelectedOptionsById: { [keyword: string]: EditCategoryRuleMode } = {};
    const localCategoryKeywordById: { [keyword: string]: CategoryKeywordEntity } = {};
    const localSelectedCategoryKeywordById: { [keyword: string]: CategoryKeywordEntity } = {};
    for (const categoryKeywordEntity of props.categoryKeywordEntities) {
      localSelectedOptionsById[categoryKeywordEntity.id] = EditCategoryRuleMode.Edit;
      localCategoryKeywordById[categoryKeywordEntity.id] = categoryKeywordEntity;
      localSelectedCategoryKeywordById[categoryKeywordEntity.id] = categoryKeywordEntity;
    }
    
    setSelectedOptionById(localSelectedOptionsById);
    setCategoryKeywordById(localCategoryKeywordById);
    setSelectCategoryKeywordById(localSelectedCategoryKeywordById);
    
    // for (const categoryKeywordEntity of props.categoryKeywordEntities) {
    //   setSelectedOptionById((prevState) => {
    //     return {
    //       ...prevState,
    //       [categoryKeywordEntity.id]: EditCategoryRuleMode.Edit,
    //     };
    //   });
    //   setCategoryKeywordById((prevState) => {
    //     return {
    //       ...prevState,
    //       [categoryKeywordEntity.id]: categoryKeywordEntity,
    //     };
    //   });
    // }
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

  function handleCategoryKeywordOptionChange(selectedCategoryKeywordEntityId: string): void {
    console.log('handleCategoryKeywordOptionChange', selectedCategoryKeywordEntityId);
    // const currentCategoryKeywordById: { [keyword: string]: CategoryKeywordEntity } = cloneDeep(categoryKeywordById);
    // const currentCategoryByKeyword: CategoryKeywordEntity = currentCategoryKeywordById[categoryKeywordEntity.id];
    // currentCategoryByKeyword.keyword = keyword;
    // setCategoryKeywordById(currentCategoryKeywordById);
  }


  function handleCategoryChange(event: React.ChangeEvent<HTMLInputElement>): void {
    console.log('handleCategoryChange', event.target.value);
    setSelectedCategoryId(event.target.value as string);
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
                            value={selectCategoryKeywordById[categoryKeywordEntity.id].id}
                            helperText="Select the keyword"
                            variant="standard"
                            onChange={(event) => handleCategoryKeywordOptionChange(event.target.value)}
                            disabled={selectedOptionById[categoryKeywordEntity.id] !== EditCategoryRuleMode.Choose}
                          >
                            {props.categoryKeywordEntities.map((categoryKeywordEntity: CategoryKeywordEntity) => (
                              <MenuItem key={categoryKeywordEntity.id} value={categoryKeywordEntity.id}>
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
                  value={getCategory(categoryKeywordEntity.categoryId)}
                  helperText="Select the associated category"
                  variant="standard"
                  onChange={handleCategoryChange}
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
