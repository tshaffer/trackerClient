import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Tabs, Tab, Box, Typography, Button } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';

import { TrackerDispatch } from '../models';

import StatementsTable from './StatementsTable';
import UploadStatementDialog from './UploadStatementDialog';
import { uploadFile } from '../controllers';

export interface StatementsContentPropsFromParent {
  activeTab: number;
}

interface StatementsContentProps extends StatementsContentPropsFromParent {
  onUploadFile: (data: FormData) => any;
}

const StatementsContent: React.FC<StatementsContentProps> = (props: StatementsContentProps) => {

  const [tabIndex, setTabIndex] = React.useState(props.activeTab);
  const [showUploadStatementDialog, setShowUploadStatementDialog] = React.useState(false);

  React.useEffect(() => {
    setTabIndex(props.activeTab);
  }, [props.activeTab]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleCloseUploadStatementDialog = () => {
    setShowUploadStatementDialog(false);
  };

  return (
    <div>
      <UploadStatementDialog
        open={showUploadStatementDialog}
        onClose={handleCloseUploadStatementDialog}
      />
      <Box sx={{ width: '100%' }}>
        <Typography variant="h4">Statements</Typography>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="All" />
          <Tab label="Credit Card" />
        </Tabs>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            startIcon={<UploadIcon />}
            onClick={() => setShowUploadStatementDialog(true)}
          >
            Upload
          </Button>
        </Box>
        <Box>
          {tabIndex === 0 && (
            <Box>
              <StatementsTable />
            </Box>
          )}
          {tabIndex === 1 && (
            <Box>
              <StatementsTable />
            </Box>
          )}
        </Box>
      </Box>
    </div>

  );
};

function mapStateToProps(state: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
    onUploadFile: uploadFile,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(StatementsContent);
