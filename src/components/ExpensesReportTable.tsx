import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import '../styles/Tracker.css';
import { BankTransactionEntity, BankTransactionType, CategorizedTransactionEntity, CategoryExpensesData, CheckingAccountTransactionEntity, CreditCardTransactionEntity } from '../types';
import { formatCurrency, formatPercentage, formatDate, expensesPerMonth } from '../utilities';

interface ExpensesReportTableProps {
  categoryExpenses: CategoryExpensesData[];
  startDate: string;
  endDate: string;
}

const ExpensesReportTable: React.FC<ExpensesReportTableProps> = ({ categoryExpenses: rows, startDate, endDate }) => {
  
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

  const getTransactionDetails = (bankTransactionEntity: BankTransactionEntity): string => {
    if (bankTransactionEntity.bankTransactionType === BankTransactionType.CreditCard) {
      return (bankTransactionEntity as CreditCardTransactionEntity).description;
    } else {
      return (bankTransactionEntity as CheckingAccountTransactionEntity).name;
    }
  }
  
  const handleButtonClick = (rowId: string) => {
    setSelectedRowId(prevRowId => (prevRowId === rowId ? null : rowId));
  };

  let totalAmount = 0;
  for (const row of rows) {
    totalAmount += row.totalExpenses;
  }

  const sortedRows = sortCategoriesByTotalExpenses(rows);

  return (
    <React.Fragment>
      <h4>Total Amount: {formatCurrency(totalAmount)}</h4>
      <h4>Per Month: {expensesPerMonth(totalAmount, startDate, endDate)}</h4>
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
      <div className="table-body">
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
                  {categoryExpenses.transactions.map((transaction: CategorizedTransactionEntity) => (
                    <div className="table-row" key={transaction.bankTransactionEntity.id}>
                      <div className="table-cell"></div>
                      <div className="table-cell">{formatDate(transaction.bankTransactionEntity.transactionDate)}</div>
                      <div className="table-cell">{formatCurrency(-transaction.bankTransactionEntity.amount)}</div>
                      <div className="table-cell">{getTransactionDetails(transaction.bankTransactionEntity)}</div>
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

export default ExpensesReportTable;
