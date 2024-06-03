import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import IconButton from '@mui/material/IconButton';

import '../styles/Tracker.css';
import { CategoryExpensesData, CheckingAccountTransactionEntity, CreditCardTransactionEntity, TransactionEntity } from '../types';
import { isNil } from 'lodash';

interface ExpensesReportTableProps {
  categoryExpenses: CategoryExpensesData[];
}

const ExpensesReportTable: React.FC<ExpensesReportTableProps> = ({ categoryExpenses: rows }) => {
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  };

  const handleButtonClick = (rowId: string) => {
    setSelectedRowId(prevRowId => (prevRowId === rowId ? null : rowId));
  };

  return (
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
  );
};

export default ExpensesReportTable;
