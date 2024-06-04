import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import '../styles/Tracker.css';
import { CategoryExpensesData, TransactionEntity } from '../types';
import { formatCurrency, formatPercentage, formatDate, expensesPerMonth } from '../utilities';

interface ExpensesReportTableProps {
  categoryExpenses: CategoryExpensesData[];
  startDate: string;
  endDate: string;
}

const ExpensesReportTable: React.FC<ExpensesReportTableProps> = ({ categoryExpenses: rows, startDate, endDate }) => {
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const handleButtonClick = (rowId: string) => {
    setSelectedRowId(prevRowId => (prevRowId === rowId ? null : rowId));
  };

  let totalAmount = 0;
  for (const row of rows) {
    totalAmount += row.totalExpenses;
  }

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
        {rows.map((row: CategoryExpensesData) => (
          <React.Fragment key={row.id}>
            <div className="table-row">
              <div className="table-cell">
                <IconButton onClick={() => handleButtonClick(row.id)}>
                  {selectedRowId === row.id ? <RemoveIcon /> : <AddIcon />}
                </IconButton>
              </div>
              <div className="table-cell">{row.categoryName}</div>
              <div className="table-cell">{row.transactionCount}</div>
              <div className="table-cell">{formatCurrency(row.totalExpenses)}</div>
              <div className="table-cell">{formatPercentage(row.percentageOfTotal)}</div>
            </div>
            {selectedRowId === row.id && (
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
                  {row.transactions.map((transaction: TransactionEntity) => (
                    <div className="table-row" key={transaction.id}>
                      <div className="table-cell"></div>
                      <div className="table-cell">{formatDate(transaction.transactionDate)}</div>
                      <div className="table-cell">{formatCurrency(-transaction.amount)}</div>
                      <div className="table-cell">{transaction.description}</div>
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
