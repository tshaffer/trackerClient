import * as React from 'react';
import ReportGrid from './ReportGrid';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TrackerDispatch } from '../models';
import { CategoryExpensesData, CreditCardTransactionEntity, StringToTransactionsLUT } from '../types';
import { getTransactionsByCategory } from '../selectors';
import { isEmpty } from 'lodash';
import ExpensesReportTable from './ExpensesReportTable';

// const rows = [
//   {
//     id: '1',
//     categoryName: 'Groceries',
//     transactions: [
//       {
//         id: '10',
//         description: 'Safeway',
//         date: '2021-10-01',
//         amount: 100,
//       },
//       {
//         id: '11',
//         description: 'Walmart',
//         date: '2021-10-02',
//         amount: 200,
//       }
//     ],
//     totalAmount: 300,
//     transactionCount: 2,
//     percentage: 50,
//   },
//   {
//     id: '2',
//     categoryName: 'Travel',
//     transactions: [
//       {
//         id: '12',
//         description: 'Hawaii',
//         date: '2021-02-01',
//         amount: 22,
//       },
//       {
//         id: '13',
//         description: 'Sedona',
//         date: '2023-02-01',
//         amount: 66,
//       },
//       {
//         id: '14',
//         description: 'Belize',
//         date: '2021-03-02',
//         amount: 33,
//       }
//     ],
//     totalAmount: 121,
//     transactionCount: 3,
//     percentage: 60,
//   }
// ]

export interface ReportProps {
  transactionsByCategory: StringToTransactionsLUT,
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
        const transactions: CreditCardTransactionEntity[] = props.transactionsByCategory[categoryName];
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
    <ExpensesReportTable categoryExpenses={rows} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Report);
