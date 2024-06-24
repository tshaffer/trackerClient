import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import '../styles/Tracker.css';
import { BankTransaction, BankTransactionType, CategorizedTransaction, CategoryExpensesData, CheckingAccountTransaction, CreditCardTransaction, StringToTransactionsLUT } from '../types';
import { formatCurrency, formatPercentage, formatDate, expensesPerMonth, roundTo } from '../utilities';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TrackerDispatch } from '../models';
import { getStartDate, getEndDate, getTransactionsByCategory } from '../selectors';
import { isEmpty } from 'lodash';

interface SpendingReportTableProps {
  startDate: string;
  endDate: string;
  transactionsByCategory: StringToTransactionsLUT,
}

const SpendingReportTable: React.FC<SpendingReportTableProps> = (props: SpendingReportTableProps) => {

  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const sortCategoriesByTotalExpenses = (categoryExpenses: CategoryExpensesData[]): CategoryExpensesData[] => {
    return categoryExpenses.sort((a, b) => {
      if (a.totalExpenses < b.totalExpenses) {
        return 1;
      }
      if (a.totalExpenses > b.totalExpenses) {
        return -1;
      }
      return 0;
    });
  };

  const getTransactionDetails = (bankTransaction: BankTransaction): string => {
    if (bankTransaction.bankTransactionType === BankTransactionType.CreditCard) {
      return (bankTransaction as CreditCardTransaction).description;
    } else {
      return (bankTransaction as CheckingAccountTransaction).name;
    }
  }

  const getRows = (): CategoryExpensesData[] => {

    const rows: CategoryExpensesData[] = [];

    let categoryRowIndex = 0;

    for (const categoryName in props.transactionsByCategory) {
      if (Object.prototype.hasOwnProperty.call(props.transactionsByCategory, categoryName)) {
        const transactions: CategorizedTransaction[] = props.transactionsByCategory[categoryName];
        const totalExpenses = -1 * roundTo((transactions.reduce((sum, transaction) => sum + transaction.bankTransaction.amount, 0)), 2);

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

  const handleButtonClick = (rowId: string) => {
    setSelectedRowId(prevRowId => (prevRowId === rowId ? null : rowId));
  };

  const rows: CategoryExpensesData[] = getRows();

  let totalAmount = 0;
  for (const row of rows) {
    totalAmount += row.totalExpenses;
  }

  const sortedRows = sortCategoriesByTotalExpenses(rows);

  return (
    <React.Fragment>
      <h4>Total Amount: {formatCurrency(totalAmount)}</h4>
      <h4>Per Month: {expensesPerMonth(totalAmount, props.startDate, props.endDate)}</h4>
      <div className="table-container">
        <div className="table-header">
          <div className="table-row">
            <div className="table-cell"></div>
            <div className="table-cell">Category</div>
            <div className="table-cell">Transaction Count</div>
            <div className="table-cell">Total Amount</div>
            <div className="table-cell">Percentage of Total</div>
          </div>
        </div>
        <div className="spending-report-table-body">
          {sortedRows.map((categoryExpenses: CategoryExpensesData) => (
            <React.Fragment key={categoryExpenses.id}>
              <div className="table-row">
                <div className="table-cell">
                  <IconButton onClick={() => handleButtonClick(categoryExpenses.id)}>
                    {selectedRowId === categoryExpenses.id ? <RemoveIcon /> : <AddIcon />}
                  </IconButton>
                </div>
                <div className="table-cell">{categoryExpenses.categoryName}</div>
                <div className="table-cell">{categoryExpenses.transactionCount}</div>
                <div className="table-cell">{formatCurrency(categoryExpenses.totalExpenses)}</div>
                <div className="table-cell">{formatPercentage(categoryExpenses.percentageOfTotal)}</div>
              </div>
              {selectedRowId === categoryExpenses.id && (
                <div className="details-table-container">
                  <div className="table-header">
                    <div className="table-row">
                      <div className="table-cell"></div>
                      <div className="table-cell">Date</div>
                      <div className="table-cell">Amount</div>
                      <div className="table-cell">Description</div>
                    </div>
                  </div>
                  <div className="table-body">
                    {categoryExpenses.transactions.map((transaction: CategorizedTransaction) => (
                      <div className="table-row" key={transaction.bankTransaction.id}>
                        <div className="table-cell"></div>
                        <div className="table-cell">{formatDate(transaction.bankTransaction.transactionDate)}</div>
                        <div className="table-cell">{formatCurrency(-transaction.bankTransaction.amount)}</div>
                        <div className="table-cell">{getTransactionDetails(transaction.bankTransaction)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </React.Fragment >
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

export default connect(mapStateToProps, mapDispatchToProps)(SpendingReportTable);
