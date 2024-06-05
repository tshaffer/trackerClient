import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { v4 as uuidv4 } from 'uuid';

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Button, FormControl } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs, { Dayjs } from 'dayjs';

import { TrackerDispatch, addCategory, setAppInitialized } from '../models';
import { isNil } from 'lodash';
import { search, uploadFile } from '../controllers';
import Report from './Report';
import AddCategoryDialog from './AddCategoryDialog';
import { CategoryEntity } from '../types';

export interface AppProps {
  onAddCategory: (categoryEntity: CategoryEntity) => any;
  onSearch: (startDate: string, endDate: string) => any;
  onSetAppInitialized: () => any;
  onUploadFile: (formData: FormData) => any;
}

const App = (props: AppProps) => {

  const [selectedFile, setSelectedFile] = React.useState(null);
  const [showAddCategoryDialog, setShowAddCategoryDialog] = React.useState(false);

  const [startDate, setStartDate] = React.useState("2024-01-01");
  const [endDate, setEndDate] = React.useState("2024-12-31");

  const handleCloseAddCategoryDialog = () => {
    setShowAddCategoryDialog(false);
  };

  const handleAddCategory = (categoryLabel: string): void => {
    const id: string = uuidv4();
    const categoryEntity: CategoryEntity = {
      id,
      keyword: categoryLabel
    };
    props.onAddCategory(categoryEntity);
  };

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


  return (
    <div>
      <AddCategoryDialog
        open={showAddCategoryDialog}
        onAddCategory={handleAddCategory}
        onClose={handleCloseAddCategoryDialog}
      />

      <input type="file" name="file" onChange={handleFileChangeHandler} />
      <br />
      <button type="button" onClick={handleUploadFile}>Upload</button>
      <br />
      <br />
      <Button onClick={() => setShowAddCategoryDialog(true)}>Add Category</Button>
      <br />
      {renderStartDate()}
      {renderEndDate()}
      <button type="button" onClick={handleSearch}>Search</button>
      <br />
      <br />
      <Report />
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
    onAddCategory: addCategory,
    onSetAppInitialized: setAppInitialized,
    onUploadFile: uploadFile,
    onSearch: search,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

