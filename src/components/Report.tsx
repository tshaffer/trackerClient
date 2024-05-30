import * as React from 'react';
import ReportGrid from './ReportGrid';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TrackerDispatch } from '../models';
import { CategoryRow, CreditCardTransactionEntity, StringToTransactionsLUT } from '../types';
import { getTransactionsByCategory } from '../selectors';
import { isEmpty } from 'lodash';

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

  const getRows = (): CategoryRow[] => {

    const rows: CategoryRow[] = [];

    let categoryRowIndex = 0;

    for (const categoryName in props.transactionsByCategory) {
      if (Object.prototype.hasOwnProperty.call(props.transactionsByCategory, categoryName)) {
        const transactions: CreditCardTransactionEntity[] = props.transactionsByCategory[categoryName];
        const totalAmount = -1 * (transactions.reduce((sum, transaction) => sum + transaction.amount, 0));

        const categoryRow: CategoryRow = {
          id: categoryRowIndex.toString(),
          categoryName,
          transactions,
          totalAmount,
          transactionCount: transactions.length,
          percentage: 0,
        };
        rows.push(categoryRow);

        categoryRowIndex += 1;
      }
    }

    const totalAmount = rows.reduce((sum, row) => sum + row.totalAmount, 0);
    for (const row of rows) {
      row.percentage = (row.totalAmount / totalAmount) * 100;
    }
    
    return rows;
  }

  if (isEmpty(props.transactionsByCategory)) {
    return null;
  }

  const rows = getRows();

  return (
    <ReportGrid rows={rows} />
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
