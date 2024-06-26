import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { v4 as uuidv4 } from 'uuid';

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Button, FormControl } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs, { Dayjs } from 'dayjs';

import { TrackerDispatch, setAppInitialized } from '../models';
import {
  addCategoryKeywordServerAndRedux,
  addCategoryServerAndRedux,
  loadCategories,
  loadCategoryKeywords
} from '../controllers';
import { isNil } from 'lodash';
import { search, uploadFile } from '../controllers';
import Report from './Report';
import AddCategoryDialog from './AddCategoryDialog';
import { CategoryEntity, CategoryKeywordEntity, DisregardLevel } from '../types';
import { getAppInitialized } from '../selectors';
import CategoriesAccordion from './CategoriesAccordion';
import AddRuleDialog from './AddRuleDialog';
import CategoryKeywordsTable from './CategoryKeywordsTable';

export interface AppProps {
  appInitialized: boolean;
  onAddCategory: (categoryEntity: CategoryEntity) => any;
  onAddCategoryKeyword: (categoryKeywordEntity: CategoryKeywordEntity) => any;
  onLoadCategories: () => any;
  onLoadCategoryKeywords: () => any;
  onSearch: (startDate: string, endDate: string) => any;
  onSetAppInitialized: () => any;
  onUploadFile: (formData: FormData) => any;
}

const App = (props: AppProps) => {

  const [selectedFile, setSelectedFile] = React.useState(null);
  const [showAddCategoryDialog, setShowAddCategoryDialog] = React.useState(false);
  const [showAddCategoryKeywordDialog, setShowAddCategoryKeywordDialog] = React.useState(false);

  const [startDate, setStartDate] = React.useState("2023-01-01");
  const [endDate, setEndDate] = React.useState("2023-12-31");

  React.useEffect(() => {
    if (!props.appInitialized) {
      props.onLoadCategories()
        .then(() => {
          return props.onLoadCategoryKeywords();
        })
        .then(() => {
          console.log('invoke onSetAppInitialized');
          return props.onSetAppInitialized();
        })
    }
  }, [props.appInitialized]);

  const handleCloseAddCategoryDialog = () => {
    setShowAddCategoryDialog(false);
  };

  const handleCloseAddCategoryKeywordDialog = () => {
    setShowAddCategoryKeywordDialog(false);
  };

  const handleAddCategory = (categoryLabel: string): void => {
    const id: string = uuidv4();
    const categoryEntity: CategoryEntity = {
      id,
      keyword: categoryLabel,
      disregardLevel: DisregardLevel.None,
    };
    props.onAddCategory(categoryEntity);
  };

  const handleAddCategoryKeyword = (categoryKeyword: string, categoryId: string): void => {
    const id: string = uuidv4();
    const categoryKeywordEntity: CategoryKeywordEntity = {
      id,
      keyword: categoryKeyword,
      categoryId
    };
    props.onAddCategoryKeyword(categoryKeywordEntity);
  }

  const handleFileChangeHandler = (e: any) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadFile = () => {
    if (!isNil(selectedFile)) {
      const data = new FormData();
      data.append('file', selectedFile);
      console.log('handleUploadFile, selectedFile: ', selectedFile);
      props.onUploadFile(data)
        .then((response: any) => {
          console.log(response);
          console.log(response.statusText);
        }).catch((err: any) => {
          console.log('uploadFile returned error');
          console.log(err);
        });
    }
  };

  const handleSetStartDate = (dateDayJs: Dayjs | null) => {
    if (!isNil(dateDayJs)) {
      const date: Date = dateDayJs.toDate();
      setStartDate(date.toISOString());
    }
  };

  const handleSetEndDate = (dateDayJs: Dayjs | null) => {
    if (!isNil(dateDayJs)) {
      const date: Date = dateDayJs.toDate();
      setEndDate(date.toISOString());
    }
  };

  const handleSearch = (): void => {
    props.onSearch(startDate, endDate);
  }

  const renderStartDate = (): JSX.Element => {
    return (
      <React.Fragment>
        <FormControl style={{ marginLeft: '6px', display: 'block' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                label="Date"
                value={dayjs(startDate)}
                onChange={(newValue) => handleSetStartDate(newValue)}
              />
            </DemoContainer>
          </LocalizationProvider>
        </FormControl>
      </React.Fragment>
    );
  };

  const renderEndDate = (): JSX.Element => {
    return (
      <React.Fragment>
        <FormControl style={{ marginLeft: '6px', display: 'block' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                label="Date"
                value={dayjs(endDate)}
                onChange={(newValue) => handleSetEndDate(newValue)}
              />
            </DemoContainer>
          </LocalizationProvider>
        </FormControl>
      </React.Fragment>
    );
  };


  if (!props.appInitialized) {
    return null;
  }

  return (
    <div>
      <AddCategoryDialog
        open={showAddCategoryDialog}
        onAddCategory={handleAddCategory}
        onClose={handleCloseAddCategoryDialog}
      />

      {/* <AddCategoryKeywordDialog */}
      <AddRuleDialog
        open={showAddCategoryKeywordDialog}
        unidentifiedBankTransactionId={''}
        onAddRule={handleAddCategoryKeyword}
        onClose={handleCloseAddCategoryKeywordDialog}
      />

      <CategoryKeywordsTable />
      <br />
      <input type="file" name="file" onChange={handleFileChangeHandler} />
      <br />
      <button type="button" onClick={handleUploadFile}>Upload</button>
      <br />
      <br />
      <Button onClick={() => setShowAddCategoryDialog(true)}>Add Category</Button>
      <Button onClick={() => setShowAddCategoryKeywordDialog(true)}>Add Category Keyword</Button>
      <br />
      {renderStartDate()}
      {renderEndDate()}
      <button type="button" onClick={handleSearch}>Search</button>
      <br />
      <br />
      <Report />
      <br />
      <CategoriesAccordion />
      <br />
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    appInitialized: getAppInitialized(state),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
    onAddCategory: addCategoryServerAndRedux,
    onAddCategoryKeyword: addCategoryKeywordServerAndRedux,
    onSetAppInitialized: setAppInitialized,
    onUploadFile: uploadFile,
    onSearch: search,
    onLoadCategories: loadCategories,
    onLoadCategoryKeywords: loadCategoryKeywords,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

