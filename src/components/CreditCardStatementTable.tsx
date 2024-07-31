import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useNavigate } from 'react-router-dom';

import '../styles/Grid.css';

import { Button } from '@mui/material';

import { isNil } from 'lodash';

import { TrackerDispatch } from '../models';
import { CreditCardTransaction, CreditCardTransactionRowInStatementTableProperties } from '../types';
import { getCreditCardTransactionRowInStatementTableProperties, getTransactionsByStatementId } from '../selectors';

import CreditCardStatementTransactionRow from './CreditCardStatementTransactionRow';

interface CreditCardStatementTablePropsFromParent {
  creditCardStatementId: string;
  navigate: any;
}

interface CreditCardStatementTableProps extends CreditCardStatementTablePropsFromParent {
  creditCardTransactions: CreditCardTransaction[];
  creditCardTransactionRows: CreditCardTransactionRowInStatementTableProperties[];
}

const CreditCardStatementTable: React.FC<CreditCardStatementTableProps> = (props: CreditCardStatementTableProps) => {

  const [sortColumn, setSortColumn] = useState<string>('transactionDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  if (isNil(props.creditCardStatementId)) {
    return null;
  }

  console.log('props.creditCardTransactionRows');
  console.log(props.creditCardTransactionRows);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const sortedTransactions = [...(props.creditCardTransactions)].sort((a: any, b: any) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue < bValue) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const renderSortIndicator = (column: string) => {
    if (sortColumn !== column) return null;
    return sortOrder === 'asc' ? ' ▲' : ' ▼';
  };

  const navigate = useNavigate();

  console.log('render CreditCardStatementTable', props.creditCardStatementId);

  return (
    <React.Fragment>
      <Button onClick={() => navigate(-1)}>Back</Button>
      <div className="credit-card-statement-grid-table-container">
        <div className="grid-table-header">
          <div className="grid-table-cell"></div>
          <div className="grid-table-cell" onClick={() => handleSort('transactionDate')}>Date{renderSortIndicator('transactionDate')}</div>
          <div className="grid-table-cell" onClick={() => handleSort('amount')}>Amount{renderSortIndicator('amount')}</div>
          <div className="grid-table-cell" onClick={() => handleSort('description')}>Description{renderSortIndicator('description')}</div>
          <div className="grid-table-cell"></div>
          <div className="grid-table-cell" onClick={() => handleSort('userDescription')}>User Description{renderSortIndicator('userDescription')}</div>
          <div className="grid-table-cell" onClick={() => handleSort('category')}>Category from statement{renderSortIndicator('category')}</div>
          <div className="grid-table-cell"></div>
          <div className="grid-table-cell" onClick={() => handleSort('amount')}>Category (rule){renderSortIndicator('amount')}</div>
          <div className="grid-table-cell" onClick={() => handleSort('amount')}>Pattern{renderSortIndicator('amount')}</div>
          <div className="grid-table-cell" onClick={() => handleSort('amount')}>Category (override){renderSortIndicator('amount')}</div>
          <div className="grid-table-cell" onClick={() => handleSort('amount')}>Category{renderSortIndicator('amount')}</div>
        </div>
        <div className="grid-table-body">
          {sortedTransactions.map((creditCardTransaction: CreditCardTransaction) => (
            <div className="grid-table-row" key={creditCardTransaction.id}>
              <CreditCardStatementTransactionRow creditCardTransactionId={creditCardTransaction.id} />
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}

function mapStateToProps(state: any, ownProps: CreditCardStatementTablePropsFromParent) {
  return {
    creditCardTransactions: getTransactionsByStatementId(state, ownProps.creditCardStatementId) as CreditCardTransaction[],
    creditCardTransactionRows: getCreditCardTransactionRowInStatementTableProperties(state, ownProps.creditCardStatementId),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CreditCardStatementTable);

