import React, { useState } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Checkbox,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
  Box
} from '@mui/material';
import { TrackerDispatch } from '../models';

export interface ReportFiltersDialogPropsFromParent {
  items: any[];
  open: boolean;
  onClose: () => void;
}

interface ReportFiltersDialogProps extends ReportFiltersDialogPropsFromParent {
}

const ReportFiltersDialog = (props: ReportFiltersDialogProps) => {

  const [checked, setChecked] = useState({} as any);

  const handleToggle = (index: number) => () => {
    setChecked((prevState: any) => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };
  if (!props.open) {
    return null;
  }

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Filters</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Specify the Categories to exclude from the report.
        </Typography>
        <List>
          {props.items.map((item, index) => (
            <ListItem key={index} button onClick={handleToggle(index)}>
              <Box display="flex" alignItems="center">
                <Checkbox
                  edge="start"
                  onChange={handleToggle(index)}
                  checked={checked[index] || false}
                />
                <Box ml={'4px'}>
                  <ListItemText primary={item.label} />
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function mapStateToProps(state: any, ownProps: ReportFiltersDialogPropsFromParent) {
  return {
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportFiltersDialog);
