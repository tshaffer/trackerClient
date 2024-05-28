import * as React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Box } from '@mui/material';

import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

import { TrackerDispatch } from '../models';

type MuiXProduct = TreeViewBaseItem<{
  internalId: string;
  label: string;
}>;

const getItemId = (item: MuiXProduct) => {
  return item.internalId;
};

export interface ReportTreePropsFromParent {
  muiXProducts: MuiXProduct[],
}

export interface ReportTreeProps extends ReportTreePropsFromParent {
}

const ReportTree = (props: ReportTreeProps) => {

  return (
    <Box sx={{ minHeight: 200, flexGrow: 1, maxWidth: 400 }}>
      <RichTreeView items={props.muiXProducts} getItemId={getItemId} />
    </Box>
  );
};

function mapStateToProps(state: any, ownProps: ReportTreePropsFromParent) {
  return {
    muiXProducts: ownProps.muiXProducts,
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportTree);
