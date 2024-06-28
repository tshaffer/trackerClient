import React from 'react';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import { Alert, Button, DialogActions, DialogContent } from '@mui/material';
import { getAppInitialized, getCheckingAccountStatements, getCreditCardStatements } from '../selectors';
import { isNil } from 'lodash';
import { bindActionCreators } from 'redux';
import { loadCategories, loadCheckingAccountStatements, loadCreditCardStatements, loadMinMaxTransactionDates, uploadFile } from '../controllers';
import { TrackerDispatch } from '../models';
import { CheckingAccountStatement, CreditCardStatement } from '../types';

export interface UploadStatementDialogPropsFromParent {
  open: boolean;
  onClose: () => void;
}

export interface UploadStatementDialogProps extends UploadStatementDialogPropsFromParent {
  appInitialized: boolean;
  checkingAccountStatementState: CheckingAccountStatement[],
  creditCardStatementState: CreditCardStatement[],
  onUploadFile: (data: FormData) => any;
  onLoadCategories: () => any;
  onLoadCreditCardStatements: () => any;
  onLoadCheckingAccountStatements: () => any;
  onLoadMinMaxTransactionDates: () => any;
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

  const handleCloseErrorDialog = () => {
    setUploadStatus(null);
  }

  const handleFileChangeHandler = (e: any) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadFile = () => {
    if (!isNil(selectedFile)) {
      const statementExists: boolean = props.checkingAccountStatementState.some(statement => statement.fileName === (selectedFile as any).name) || props.creditCardStatementState.some(statement => statement.fileName ===  (selectedFile as any).name);
      if (statementExists) {
        setUploadStatus('The selected statement has already been uploaded. Please select a different statement.');
        return;
      }
      const data = new FormData();
      data.append('file', selectedFile);
      props.onUploadFile(data)
        .then((response: any) => {
          setUploadStatus('success');
          props.onLoadCategories()
            .then(() => {
              return props.onLoadCreditCardStatements();
            })
            .then(() => {
              return props.onLoadCheckingAccountStatements();
            })
            .then(() => {
              return props.onLoadMinMaxTransactionDates();
            });

        }).catch((err: any) => {
          console.log('uploadFile returned error');
          console.log(err);
          setUploadStatus('Upload Failed: Please try again.');
        });
    }
  }


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
        <Dialog open={true} onClose={handleCloseErrorDialog}>
          <DialogContent>
            {uploadStatus === 'success' ? (
              <Alert severity="success">Upload Successful</Alert>
            ) : (
              <Alert severity="error">{uploadStatus}</Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseErrorDialog} color="primary">
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
    checkingAccountStatementState: getCheckingAccountStatements(state),
    creditCardStatementState: getCreditCardStatements(state),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
    onUploadFile: uploadFile,
    onLoadCategories: loadCategories,
    onLoadCreditCardStatements: loadCreditCardStatements,
    onLoadCheckingAccountStatements: loadCheckingAccountStatements,
    onLoadMinMaxTransactionDates: loadMinMaxTransactionDates,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadStatementDialog);



