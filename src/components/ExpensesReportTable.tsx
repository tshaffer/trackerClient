import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import IconButton from '@mui/material/IconButton';

import '../styles/Tracker.css';
import { CategoryExpensesData } from '../types';

interface ExpensesReportTableProps {
  categoryExpenses: CategoryExpensesData[];
}

const ExpensesReportTable: React.FC<ExpensesReportTableProps> = ({ categoryExpenses: rows }) => {
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const handleButtonClick = (rowId: string) => {
    setSelectedRowId(prevRowId => (prevRowId === rowId ? null : rowId));
  };

  /*
              <div className="detail-row">
                <div className="detail-cell">
                  Category: {row.categoryName}
                </div>
              </div>
  */

              /*
                  <div className="table-row">
                    <div className="table-cell">03/04/2023</div>
                    <div className="table-cell">$69.12</div>
                    <div className="table-cell">Pizza</div>
                  </div>
              */

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
              <div className="table-cell">{row.totalExpenses}</div>
              <div className="table-cell">{row.percentageOfTotal}</div>
            </div>
            {selectedRowId === row.id && (
              <React.Fragment>
                <div className="table-header">
                  <div className="table-row">
                    <div className="table-cell">Date</div>
                    <div className="table-cell">Amount</div>
                    <div className="table-cell">Description</div>
                  </div>
                </div>
                <div className="table-body">
                  {row.transactions.map(transaction => (
                    <div className="table-row" key={transaction.id}>
                      <div className="table-cell">{transaction.transactionDate}</div>
                      <div className="table-cell">{transaction.amount}</div>
                      <div className="table-cell">{transaction.description}</div>
                    </div>
                  ))}
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ExpensesReportTable;
