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
import OverrideTransactionCategoriesDialog from './OverrideTransactionCategoriesDialog';
import { updateCategoryInTransactions } from '../controllers';

interface CreditCardStatementTablePropsFromParent {
  creditCardStatementId: string;
  navigate: any;
}

interface CreditCardStatementTableProps extends CreditCardStatementTablePropsFromParent {
  creditCardTransactions: CreditCardTransaction[];
  creditCardTransactionRows: CreditCardTransactionRowInStatementTableProperties[];
  onUpdateCategoryTransactions: (categoryId: string, transactionIds: string[]) => any;
}

const CreditCardStatementTable: React.FC<CreditCardStatementTableProps> = (props: CreditCardStatementTableProps) => {

  const [sortColumn, setSortColumn] = useState<string>('transactionDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedTransactionIds, setSelectedTransactionId] = useState<Set<string>>(new Set());
  const [showOverrideTransactionCategoriesDialog, setShowOverrideTransactionCategoriesDialog] = React.useState(false);

  if (isNil(props.creditCardStatementId)) {
    return null;
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const handleOverrideTransactionCategories = () => {
    setShowOverrideTransactionCategoriesDialog(true);
  };

  const handleSaveOverrideTransactionCategories = (categoryId: string) => {
    props.onUpdateCategoryTransactions(categoryId, Array.from(selectedTransactionIds));
  };

  const handleCloseOverrideTransactionCategoriesDialog = () => {
    setShowOverrideTransactionCategoriesDialog(false);
  }

  function handleSetCreditCardTransactionSelected(transactionId: string, selected: boolean): any {
    const newSelectedTransactionIds = new Set(selectedTransactionIds);
    if (selected) {
      newSelectedTransactionIds.add(transactionId);
    } else {
      newSelectedTransactionIds.delete(transactionId);
    }
    setSelectedTransactionId(newSelectedTransactionIds);
  }

  const sortedTransactions = [...(props.creditCardTransactionRows)].sort((a: any, b: any) => {
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
      <OverrideTransactionCategoriesDialog
        open={showOverrideTransactionCategoriesDialog}
        onClose={handleCloseOverrideTransactionCategoriesDialog}
        onSave={handleSaveOverrideTransactionCategories}
      />

      <Button
        onClick={() => handleOverrideTransactionCategories()}
        disabled={selectedTransactionIds.size === 0}
      >
        Override Selected
      </Button>
      <Button onClick={() => navigate(-1)}>Back</Button>
      <div className="credit-card-statement-grid-table-container">
        <div className="grid-table-header">
          <div className="grid-table-cell"></div>
          <div className="grid-table-cell" onClick={() => handleSort('transactionDate')}>Date{renderSortIndicator('transactionDate')}</div>
          <div className="grid-table-cell" onClick={() => handleSort('amount')}>Amount{renderSortIndicator('amount')}</div>
          <div className="grid-table-cell" onClick={() => handleSort('description')}>Description{renderSortIndicator('description')}</div>
          <div className="grid-table-cell"></div>
          <div className="grid-table-cell" onClick={() => handleSort('userDescription')}>User Description{renderSortIndicator('userDescription')}</div>
          <div className="grid-table-cell" onClick={() => handleSort('categorizedTransactionName')}>Category{renderSortIndicator('categorizedTransactionName')}</div>
          <div className="grid-table-cell" onClick={() => handleSort('category')}>Category from statement{renderSortIndicator('category')}</div>
          <div className="grid-table-cell"></div>
          <div className="grid-table-cell" onClick={() => handleSort('categoryNameFromCategoryAssignmentRule')}>Category (rule){renderSortIndicator('categoryNameFromCategoryAssignmentRule')}</div>
          <div className="grid-table-cell" onClick={() => handleSort('patternFromCategoryAssignmentRule')}>Pattern{renderSortIndicator('patternFromCategoryAssignmentRule')}</div>
          <div className="grid-table-cell" onClick={() => handleSort('categoryNameFromCategoryOverride')}>Category (override){renderSortIndicator('categoryNameFromCategoryOverride')}</div>
        </div>
        <div className="grid-table-body">
          {sortedTransactions.map((creditCardTransaction: CreditCardTransactionRowInStatementTableProperties) => (
            <div className="grid-table-row" key={creditCardTransaction.id}>
              <CreditCardStatementTransactionRow
                creditCardTransactionId={creditCardTransaction.id}
                onSetCreditCardTransactionSelected={(transactionId: string, selected: boolean) => handleSetCreditCardTransactionSelected(transactionId, selected)}
              />
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
    onUpdateCategoryTransactions: updateCategoryInTransactions,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CreditCardStatementTable);

