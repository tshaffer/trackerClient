import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs, { Dayjs } from 'dayjs';



import { TrackerDispatch, setAppInitialized } from '../models';
import { isNil } from 'lodash';
import { FormControl } from '@mui/material';
import { search, uploadFile } from '../controllers';
import Report from './Report';
import CustomTable, { Row } from './CustomTable';

export const sampleData: Row[] = [
  { id: '1', category: 'Food', totalAmount: 150 },
  { id: '2', category: 'Transport', totalAmount: 80 },
  { id: '3', category: 'Utilities', totalAmount: 200 },
];


export interface AppProps {
  onSearch: (startDate: string, endDate: string) => any;
  onSetAppInitialized: () => any;
  onUploadFile: (formData: FormData) => any;
}

const App = (props: AppProps) => {

  const [selectedFile, setSelectedFile] = React.useState(null);
  const [uploadError, setUploadError] = React.useState(false);
  const [errorList, setErrorList] = React.useState<string[]>([]);

  const [startDate, setStartDate] = React.useState("2022-06-01");
  const [endDate, setEndDate] = React.useState("2022-12-31");

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
          // const errorList: string[] = err.response.data;
          // console.log('errorList:');
          // console.log(errorList);
          setErrorList(err.response.data);
          setUploadError(true);
        });
    }
  };

  const handleSetStartDate = (dateDayJs: Dayjs | null) => {
    if (!isNil(dateDayJs)) {
      const date: Date = dateDayJs.toDate();
      setStartDate(date.toISOString());}
  };

  const handleSetEndDate = (dateDayJs: Dayjs | null) => {
    if (!isNil(dateDayJs)) {
      const date: Date = dateDayJs.toDate();
      setEndDate(date.toISOString());}
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
      {/* <CustomTable rows={sampleData}/> */}
      <input type="file" name="file" onChange={handleFileChangeHandler} />
      <br />
      <button type="button" onClick={handleUploadFile}>Upload</button>
      <br />
      <br />
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
    onSetAppInitialized: setAppInitialized,
    onUploadFile: uploadFile,
    onSearch: search,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

