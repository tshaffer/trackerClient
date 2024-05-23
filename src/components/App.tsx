import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TrackerDispatch, setAppInitialized } from '../models';
import { isNil } from 'lodash';

export interface AppProps {
  onSetAppInitialized: () => any;
}

const App = (props: AppProps) => {

  const [selectedFile, setSelectedFile] = React.useState(null);
  const [uploadError, setUploadError] = React.useState(false);
  const [errorList, setErrorList] = React.useState<string[]>([]);

  const handleFileChangeHandler = (e: any) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadFile = () => {
    if (!isNil(selectedFile)) {
      const data = new FormData();
      data.append('file', selectedFile);
      console.log('handleUploadFile, selectedFile: ', selectedFile);
      // props.onUploadFile(data)
      //   .then((response: any) => {
      //     console.log(response);
      //     console.log(response.statusText);
      //   }).catch((err: any) => {
      //     console.log('uploadFile returned error');
      //     console.log(err);
      //     // const errorList: string[] = err.response.data;
      //     // console.log('errorList:');
      //     // console.log(errorList);
      //     setErrorList(err.response.data);
      //     setUploadError(true);
      //   });
    }
  };

  return (
    <div>
      <input type="file" name="file" onChange={handleFileChangeHandler} />
      <br />
      <button type="button" onClick={handleUploadFile}>Upload</button>
      <br />
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
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

