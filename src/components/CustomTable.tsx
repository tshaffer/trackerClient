import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import IconButton from '@mui/material/IconButton';

import '../styles/Tracker.css';

export interface Row {
  id: string;
  category: string;
  totalAmount: number;
}

interface CustomTableProps {
  rows: Row[];
}

const CustomTable: React.FC<CustomTableProps> = ({ rows }) => {
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const handleButtonClick = (rowId: string) => {
    setSelectedRowId(prevRowId => (prevRowId === rowId ? null : rowId));
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="table-row">
          <div className="table-cell"></div>
          <div className="table-cell">Category</div>
          <div className="table-cell">Total Amount</div>
        </div>
      </div>
      <div className="table-body">
        {rows.map((row) => (
          <React.Fragment key={row.id}>
            <div className="table-row">
              <div className="table-cell">
                <IconButton onClick={() => handleButtonClick(row.id)}>
                  {selectedRowId === row.id ? <RemoveIcon /> : <AddIcon />}
                </IconButton>
              </div>
              <div className="table-cell">{row.category}</div>
              <div className="table-cell">{row.totalAmount}</div>
            </div>
            {selectedRowId === row.id && (
              <div className="detail-row">
                <div className="detail-cell">
                  Category: {row.category}
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CustomTable;
