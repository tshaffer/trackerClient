import React from 'react';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import { Button, DialogActions, DialogContent } from '@mui/material';
import { getAppInitialized } from '../selectors';
import { isNil } from 'lodash';
import { bindActionCreators } from 'redux';
import { uploadFile } from '../controllers';
import { TrackerDispatch } from '../models';

export interface UploadStatementDialogPropsFromParent {
  open: boolean;
  onClose: () => void;
  // onUploadFile: (formData: FormData) => any;
  // onUploadStatement: (
  //   data: FormData,
  // ) => any;
}

export interface UploadStatementDialogProps extends UploadStatementDialogPropsFromParent {
  appInitialized: boolean;
  onUploadFile: (formData: FormData) => any;
}

const UploadStatementDialog = (props: UploadStatementDialogProps) => {

  const { open, onClose } = props;

  const [selectedFile, setSelectedFile] = React.useState(null);

  if (!open) {
    return null;
  }

  const handleClose = () => {
    onClose();
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

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Upload Statement</DialogTitle>
      <DialogContent style={{ paddingBottom: '0px' }}>
        <Box
          component="form"
          noValidate
          autoComplete="off"
        >
          <input type="file" name="file" style={{ width: '500px' }} onChange={handleFileChangeHandler} />
          <br />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleUploadFile} autoFocus variant="contained" color="primary">Upload</Button>
      </DialogActions>
    </Dialog>
  );
};

function mapStateToProps(state: any) {
  return {
    appInitialized: getAppInitialized(state),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
    // onUploadStatement: uploadFile,
    onUploadFile: uploadFile,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadStatementDialog);



