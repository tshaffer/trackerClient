import * as React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Box } from '@mui/material';

import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

import { isNil } from 'lodash';
import { TrackerDispatch } from '../models';
import { getTransactionsByCategory } from '../selectors';
import { StringToTransactionsLUT } from '../types';

type MuiXProduct = TreeViewBaseItem<{
  internalId: string;
  label: string;
}>;

const MUI_X_PRODUCTS: MuiXProduct[] = [
  {
    internalId: 'grid',
    label: 'Data Grid',
    children: [
      { internalId: 'grid-community', label: '@mui/x-data-grid' },
      { internalId: 'grid-pro', label: '@mui/x-data-grid-pro' },
      { internalId: 'grid-premium', label: '@mui/x-data-grid-premium' },
    ],
  },
  {
    internalId: 'pickers',
    label: 'Date and Time Pickers',
    children: [
      { internalId: 'pickers-community', label: '@mui/x-date-pickers' },
      { internalId: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
];

const getItemId = (item: MuiXProduct) => item.internalId;

export interface TransactionsReportProps {
  transactionsByCategory: StringToTransactionsLUT,
}

const TransactionsReport = (props: TransactionsReportProps) => {

  // if (isNil(props.mediaItem)) {
  //   return null;
  // }

  const renderTransactionsByCategory = () => {
    return Object.keys(props.transactionsByCategory).map((category) => {
      const transactions = props.transactionsByCategory[category];
      return (
        <div key={category}>
          <h2>{category}</h2>
          <ul>
            {transactions.map((transaction) => {
              return (
                <li key={transaction.id}>
                  {transaction.transactionDate} {transaction.description} {transaction.amount}
                </li>
              );
            })}
          </ul>
        </div>
      );
    });
  };

  return (
    <Box sx={{ minHeight: 200, flexGrow: 1, maxWidth: 400 }}>
      {/* <RichTreeView items={MUI_X_PRODUCTS} getItemId={getItemId} /> */}
      {renderTransactionsByCategory()}
    </Box>
  );
};

function mapStateToProps(state: any) {
  return {
    transactionsByCategory: getTransactionsByCategory(state),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsReport);
