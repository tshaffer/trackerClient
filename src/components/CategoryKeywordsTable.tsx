import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import '../styles/Tracker.css';
import { CategoryEntity, CategoryKeywordEntity } from '../types';
import { Box, FormControl, FormControlLabel, IconButton, MenuItem, Radio, RadioGroup, Select, TextField } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { TrackerDispatch } from '../models';
import { getCategories, getCategoryKeywordEntities } from '../selectors/categoryState';

interface CategoryKeywordsTableProps {
  categoryKeywordEntities: CategoryKeywordEntity[];
  categories: CategoryEntity[];
}

const CategoryKeywordsTable: React.FC<CategoryKeywordsTableProps> = (props: CategoryKeywordsTableProps) => {

  const [selectedOption, setSelectedOption] = React.useState('edit');
  const [textFieldValue, setTextFieldValue] = React.useState('');
  const [selectedValue, setSelectedValue] = React.useState('');

  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  function handleButtonClick(categoryKeywordEntity: CategoryKeywordEntity): void {
    throw new Error('Function not implemented.');
  }

  const getCategory = (categoryId: string): CategoryEntity => {
    return props.categories.find((category: CategoryEntity) => category.id === categoryId) as CategoryEntity;
  };

  return (
    <React.Fragment>
      <div className="table-container">
        <div className="table-header">
          <div className="table-row">
            <div className="table-cell">Keyword</div>
            <div className="table-cell">Category</div>
          </div>
        </div>
        <div className="table-body">
          {props.categoryKeywordEntities.map((categoryKeywordEntity: CategoryKeywordEntity) => (
            <div className="table-row" key={categoryKeywordEntity.id}>
              {/* <Box display="flex" alignItems="center">
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
 */}
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

              {/* <div className="table-cell">
                <TextField
                  id="standard-basic"
                  label="Standard"
                  variant="standard"
                  value={categoryKeywordEntity.keyword}
                />
                <TextField
                  id="category"
                  select
                  label="Select"
                  value={categoryKeywordEntity.categoryId}
                  helperText="Select the associated category"
                  variant="standard"
                // onChange={handleCategoryChange}
                >
                  {props.categoryKeywordEntities.map((categoryKeyword) => (
                    <MenuItem key={categoryKeyword.id} value={categoryKeyword.id}>
                      {categoryKeyword.keyword}
                    </MenuItem>
                  ))}
                </TextField>

              </div> */}
              <div className="table-cell">{getCategory(categoryKeywordEntity.categoryId).keyword}</div>
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