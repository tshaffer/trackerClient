import * as React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { TreeViewBaseItem } from '@mui/x-tree-view/models';

import { TrackerDispatch } from '../models';
import { getTransactionsByCategory } from '../selectors';
import { CreditCardTransactionEntity, StringToTransactionsLUT } from '../types';

import ReportTree from './ReportTree';
import { isEmpty } from 'lodash';

export interface TransactionsReportProps {
  transactionsByCategory: StringToTransactionsLUT,
}

type MuiXProduct = TreeViewBaseItem<{
  internalId: string;
  label: string;
}>;

const TransactionsReport = (props: TransactionsReportProps) => {

  const renderTransactionsByCategory = (): MuiXProduct[] => {

    const categoryExpenses: MuiXProduct[] = [];

    if (isEmpty(props.transactionsByCategory)) {
      return [];
    }

    for (const categoryName in props.transactionsByCategory) {
      if (Object.prototype.hasOwnProperty.call(props.transactionsByCategory, categoryName)) {
        const transactions: CreditCardTransactionEntity[] = props.transactionsByCategory[categoryName];
        const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
        const categoryExpense: MuiXProduct = {
          internalId: categoryName,
          // label: `${categoryName} (${totalAmount})`,
          label: categoryName + totalAmount.toString(),
          children: [],
        };
        categoryExpenses.push(categoryExpense);

      }
    }

    return categoryExpenses;
  }

  const categoryExpenses: MuiXProduct[] = renderTransactionsByCategory();

  if (categoryExpenses.length === 0) {
    return null;
  }

  return (
    <ReportTree muiXProducts={categoryExpenses} />
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
