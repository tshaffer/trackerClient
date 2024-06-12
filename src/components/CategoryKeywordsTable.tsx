import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import '../styles/Tracker.css';
import { CategoryEntity, CategoryKeywordEntity } from '../types';
import { Box, FormControl, FormControlLabel, IconButton, MenuItem, Radio, RadioGroup, Select, TextField } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { TrackerDispatch } from '../models';
import { getCategories, getCategoryKeywordEntities } from '../selectors/categoryState';
import { updateCategoryKeywordServerAndRedux } from '../controllers/';
import { cloneDeep } from 'lodash';

interface CategoryKeywordsTableProps {
  categoryKeywordEntities: CategoryKeywordEntity[];
  categories: CategoryEntity[];
  onUpdateCategoryKeyword: (categoryKeywordEntity: CategoryKeywordEntity) => any;
}

const CategoryKeywordsTable: React.FC<CategoryKeywordsTableProps> = (props: CategoryKeywordsTableProps) => {

  const [selectedOption, setSelectedOption] = React.useState('edit');
  const [textFieldValue, setTextFieldValue] = React.useState('');
  const [selectedValue, setSelectedValue] = React.useState('');
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>('');

  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

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


  const handleCategoryKeywordChange = (categoryKeywordEntity: CategoryKeywordEntity, keyword: string) => {
    console.log(categoryKeywordEntity);
    console.log(keyword);
    categoryKeywordEntity.keyword = keyword;
    props.onUpdateCategoryKeyword(categoryKeywordEntity);
  };

  function handleCategoryChange(event: React.ChangeEvent<HTMLInputElement>): void {
    console.log('handleCategoryChange', event.target.value);
    setSelectedCategoryId(event.target.value as string);
  }

  let alphabetizedCategoryEntities: CategoryEntity[] = cloneDeep(props.categories);
  alphabetizedCategoryEntities = sortCategoryEntities(alphabetizedCategoryEntities);

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
                    <RadioGroup row value={selectedOption} onChange={handleOptionChange}>
                      <Box display="flex" alignItems="center">
                        <FormControlLabel value="edit" control={<Radio />} label="Edit" />
                        {(
                          <TextField
                            label="Edit"
                            value={categoryKeywordEntity.keyword}
                            onChange={(event) => handleCategoryKeywordChange(categoryKeywordEntity, event.target.value)}
                            style={{ marginLeft: '16px' }}
                            disabled={selectedOption !== 'edit'}
                          />
                        )}
                      </Box>
                      <Box display="flex" alignItems="center">
                        <FormControlLabel value="choose" control={<Radio />} label="Choose" />
                        {(
                          <TextField
                            id="categoryKeyword"
                            select
                            label="Select"
                            value={selectedCategoryId}
                            helperText="Select the associated category"
                            variant="standard"
                            onChange={handleCategoryChange}
                            disabled={selectedOption !== 'choose'}
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


/*
import React, { useState } from 'react';
import { FormControl, FormControlLabel, Radio, RadioGroup, TextField, Select, MenuItem, Box } from '@mui/material';

const EditOrChooseComponent = () => {
  const [selectedOption, setSelectedOption] = useState('edit');
  const [textFieldValue, setTextFieldValue] = useState('');
  const [selectedValue, setSelectedValue] = useState('');

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <Box display="flex" alignItems="center">
      <FormControl component="fieldset">
        <RadioGroup row value={selectedOption} onChange={handleOptionChange}>
          <FormControlLabel value="edit" control={<Radio />} label="Edit" />
          <FormControlLabel value="choose" control={<Radio />} label="Choose" />
        </RadioGroup>
      </FormControl>
      {selectedOption === 'edit' && (
        <TextField
          label="Edit"
          value={textFieldValue}
          onChange={(event) => setTextFieldValue(event.target.value)}
          style={{ marginLeft: '16px' }}
        />
      )}
      {selectedOption === 'choose' && (
        <Select
          value={selectedValue}
          onChange={(event) => setSelectedValue(event.target.value)}
          displayEmpty
          style={{ marginLeft: '16px' }}
        >
          <MenuItem value="" disabled>Select an option</MenuItem>
          <MenuItem value={1}>Option 1</MenuItem>
          <MenuItem value={2}>Option 2</MenuItem>
          <MenuItem value={3}>Option 3</MenuItem>
        </Select>
      )}
    </Box>
  );
};

export default EditOrChooseComponent;
*/

/*
import React, { useState } from 'react';
import { FormControl, FormControlLabel, Radio, RadioGroup, TextField, Select, MenuItem, Box } from '@mui/material';

const EditOrChooseComponent = () => {
  const [selectedOption, setSelectedOption] = useState('edit');
  const [textFieldValue, setTextFieldValue] = useState('');
  const [selectedValue, setSelectedValue] = useState('');

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <Box display="flex" alignItems="center">
      <FormControl component="fieldset">
        <RadioGroup row value={selectedOption} onChange={handleOptionChange}>
          <Box display="flex" alignItems="center">
            <FormControlLabel value="edit" control={<Radio />} label="Edit" />
            {selectedOption === 'edit' && (
              <TextField
                label="Edit"
                value={textFieldValue}
                onChange={(event) => setTextFieldValue(event.target.value)}
                style={{ marginLeft: '16px' }}
              />
            )}
          </Box>
          <Box display="flex" alignItems="center">
            <FormControlLabel value="choose" control={<Radio />} label="Choose" />
            {selectedOption === 'choose' && (
              <Select
                value={selectedValue}
                onChange={(event) => setSelectedValue(event.target.value)}
                displayEmpty
                style={{ marginLeft: '16px' }}
              >
                <MenuItem value="" disabled>Select an option</MenuItem>
                <MenuItem value={1}>Option 1</MenuItem>
                <MenuItem value={2}>Option 2</MenuItem>
                <MenuItem value={3}>Option 3</MenuItem>
              </Select>
            )}
          </Box>
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default EditOrChooseComponent;
*/