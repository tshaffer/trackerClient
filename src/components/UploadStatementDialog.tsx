import React from 'react';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import { Alert, Button, DialogActions, DialogContent } from '@mui/material';
import { getAppInitialized } from '../selectors';
import { isNil } from 'lodash';
import { bindActionCreators } from 'redux';
import { loadCategories, loadCheckingAccountStatements, loadCreditCardStatements, uploadFile } from '../controllers';
import { TrackerDispatch } from '../models';

export interface UploadStatementDialogPropsFromParent {
  open: boolean;
  onClose: () => void;
}

export interface UploadStatementDialogProps extends UploadStatementDialogPropsFromParent {
  appInitialized: boolean;
  onUploadFile: (data: FormData) => any;
  onLoadCategories: () => any;
  onLoadCreditCardStatements: () => any;
  onLoadCheckingAccountStatements: () => any;
}

const UploadStatementDialog = (props: UploadStatementDialogProps) => {

  const { open, onClose } = props;

  const [selectedFile, setSelectedFile] = React.useState(null);
  const [uploadStatus, setUploadStatus] = React.useState<any>(null); // null, 'success', or 'failure'

  if (!open) {
    return null;
  }

  const handleClose = () => {
    setUploadStatus(null);
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
          setUploadStatus('success');

          props.onLoadCategories()
          .then(() => {
            return props.onLoadCreditCardStatements();
          })
          .then(() => {
            return props.onLoadCheckingAccountStatements();
          })
  
        }).catch((err: any) => {
          console.log('uploadFile returned error');
          console.log(err);
          setUploadStatus('failure');
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
        <Button onClick={handleUploadFile} autoFocus variant="contained" color="primary" disabled={!selectedFile}>Upload</Button>
      </DialogActions>
      {uploadStatus && (
        <Dialog open={true} onClose={handleClose}>
          <DialogContent>
            {uploadStatus === 'success' ? (
              <Alert severity="success">Upload Successful</Alert>
            ) : (
              <Alert severity="error">Upload Failed: Please try again.</Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}
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
    onUploadFile: uploadFile,
    onLoadCategories: loadCategories,
    onLoadCreditCardStatements: loadCreditCardStatements,
    onLoadCheckingAccountStatements: loadCheckingAccountStatements,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadStatementDialog);



