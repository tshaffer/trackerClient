import React, { useState } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Checkbox,
  List,
  ListItem,
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

  if (!props.open) {
    return null;
  }

  const handleToggle = (index: number) => () => {
    setChecked((prevState: any) => {
      const newChecked = { ...prevState, [index]: !prevState[index] };
      return newChecked;
    });
  };

  const handleMasterToggle = () => {
    const allChecked = areAllChecked();
    const newChecked = props.items.reduce((acc, _, index) => {
      acc[index] = !allChecked;
      return acc;
    }, {} as { [key: number]: boolean });

    setChecked(newChecked);
  };

  const areAllChecked = () => {
    return props.items.length > 0 && props.items.every((_, index) => checked[index]);
  };

  const areSomeChecked = () => {
    return props.items.some((_, index) => checked[index]) && !areAllChecked();
  };

  const masterChecked = areAllChecked();
  const indeterminate = areSomeChecked();

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle sx={{ paddingBottom: '0px' }}>Report Filters</DialogTitle>
      <DialogContent sx={{ paddingBottom: '0px' }}>
        <Box display="flex" alignItems="center" mb={0} mt={0}>
          <Checkbox
            edge="start"
            indeterminate={indeterminate}
            checked={masterChecked}
            onChange={handleMasterToggle}
          />
        </Box>
        <Typography variant="body1" gutterBottom>
          Categories to display
        </Typography>
        <List sx={{ paddingTop: '0px', paddingBottom: '0px' }}>
          {props.items.map((item, index) => (
            <ListItem key={index} sx={{ padding: '0px' }}>
              <Box display="flex" alignItems="center">
                <Checkbox
                  edge="start"
                  onChange={handleToggle(index)}
                  checked={checked[index] || false}
                />
                <Box sx={{ marginLeft: '4px' }}>
                  <ListItemText primary={item.label} />
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions sx={{ paddingTop: '0px' }}>
        <Button onClick={props.onClose} color="secondary">Cancel</Button>
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
