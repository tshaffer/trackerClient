import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TrackerDispatch } from '../models';
import { CategoryExpensesData, StringToTransactionsLUT, TransactionEntity } from '../types';
import { getEndDate, getStartDate, getTransactionsByCategory } from '../selectors';
import { isEmpty } from 'lodash';
import ExpensesReportTable from './ExpensesReportTable';
import { formatDate } from '../utilities';

export interface ReportProps {
  transactionsByCategory: StringToTransactionsLUT,
  startDate: string,
  endDate: string,
}

const Report = (props: ReportProps) => {

  const roundTo = (num: number, precision: number): number => {
    const factor = Math.pow(10, precision)
    return Math.round(num * factor) / factor
  }

  const getRows = (): CategoryExpensesData[] => {

    const rows: CategoryExpensesData[] = [];

    let categoryRowIndex = 0;

    for (const categoryName in props.transactionsByCategory) {
      if (Object.prototype.hasOwnProperty.call(props.transactionsByCategory, categoryName)) {
        const transactions: TransactionEntity[] = props.transactionsByCategory[categoryName];
        const totalExpenses = -1 * roundTo((transactions.reduce((sum, transaction) => sum + transaction.amount, 0)), 2);

        const categoryRow: CategoryExpensesData = {
          id: categoryRowIndex.toString(),
          categoryName,
          transactions,
          totalExpenses,
          transactionCount: transactions.length,
          percentageOfTotal: 0,
        };
        rows.push(categoryRow);

        categoryRowIndex += 1;
      }
    }

    const totalAmount = rows.reduce((sum, row) => sum + row.totalExpenses, 0);
    for (const row of rows) {
      row.percentageOfTotal = roundTo((row.totalExpenses / totalAmount) * 100, 2);
    }

    return rows;
  }

  if (isEmpty(props.transactionsByCategory)) {
    return null;
  }

  const rows: CategoryExpensesData[] = getRows();

  return (
    <div>
      <h1>Spending Report</h1>
      <h4>
        Date Range: {formatDate(props.startDate)} to {formatDate(props.endDate)}
      </h4>
      <ExpensesReportTable categoryExpenses={rows} />
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    startDate: getStartDate(state),
    endDate: getEndDate(state),
    transactionsByCategory: getTransactionsByCategory(state),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Report);
