import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { v4 as uuidv4 } from 'uuid';

import '../styles/Tracker.css';
import { BankTransaction, BankTransactionType, Category, CategoryAssignmentRule, CheckingAccountTransaction, CreditCardTransaction, DisregardLevel } from '../types';
import { formatCurrency, formatDate } from '../utilities';
import { IconButton } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddRuleDialog from './AddCategoryAssignmentRuleDialog';
import { addCategoryAssignmentRuleServerAndRedux, addCategoryServerAndRedux, search } from '../controllers';
import { TrackerDispatch } from '../models';
import { getStartDate, getEndDate, getUnidentifiedBankTransactions } from '../selectors';

interface NotIdentifiedTransactionTableProps {
  startDate: string;
  endDate: string;
  unidentifiedBankTransactions: BankTransaction[];
  onAddCategory: (category: Category) => any;
  onAddCategoryAssignmentRule: (categoryAssignmentRule: CategoryAssignmentRule) => any;
  onSearch: (startDate: string, endDate: string) => any;
}

const UnIdentifiedTransactionTable: React.FC<NotIdentifiedTransactionTableProps> = (props: NotIdentifiedTransactionTableProps) => {

  const [unidentifiedBankTransactionId, setUnidentifiedBankTransactionId] = React.useState('');
  const [showAddRuleDialog, setShowAddRuleDialog] = React.useState(false);

  const getTransactionTypeLabel = (bankTransactionType: BankTransactionType): string => {
    if (bankTransactionType === BankTransactionType.CreditCard) {
      return 'Credit Card';
    } else {
      return 'Checking Account';
    }
  }

  const getTransactionDetails = (bankTransaction: BankTransaction): string => {
    if (bankTransaction.bankTransactionType === BankTransactionType.CreditCard) {
      return (bankTransaction as CreditCardTransaction).description;
    } else {
      return (bankTransaction as CheckingAccountTransaction).name;
    }
  }

  const getUniqueDescriptionsCount = (unidentifiedBankTransactions: BankTransaction[]): number => {
    const uniqueDescriptions: string[] = [];
    unidentifiedBankTransactions.forEach((unidentifiedBankTransaction: BankTransaction) => {
      const description = getTransactionDetails(unidentifiedBankTransaction);
      if (!uniqueDescriptions.includes(description)) {
        uniqueDescriptions.push(description);
      }
    });
    return uniqueDescriptions.length;
  }

  const getDebitsCredits = (unidentifiedBankTransactions: BankTransaction[]): { debits: number, credits: number } => {
    let debits = 0;
    let credits = 0;
    unidentifiedBankTransactions.forEach((unidentifiedBankTransaction: BankTransaction) => {
      if (unidentifiedBankTransaction.amount < 0) {
        debits += unidentifiedBankTransaction.amount;
      } else {
        credits += unidentifiedBankTransaction.amount;
      }
    });
    return { debits, credits };
  }

  const handleButtonClick = (unidentifiedBankTransaction: BankTransaction) => {
    setUnidentifiedBankTransactionId(unidentifiedBankTransaction.id);
    setShowAddRuleDialog(true);
  };

  const handleAddRule = (pattern: string, categoryId: string): void => {
    const id: string = uuidv4();
    const categoryAssignmentRule: CategoryAssignmentRule = {
      id,
      pattern,
      categoryId
    };
    console.log('handleAddRule: ', categoryAssignmentRule, categoryAssignmentRule);
    props.onAddCategoryAssignmentRule(categoryAssignmentRule)
      .then(() => {
        props.onSearch(props.startDate, props.endDate);
      }
      );
  }

  const handleCloseAddRuleDialog = () => {
    setShowAddRuleDialog(false);
  };

  if (props.unidentifiedBankTransactions.length === 0) {
    return null;
  }

  const { debits, credits } = getDebitsCredits(props.unidentifiedBankTransactions);

  return (
    <React.Fragment>
      <AddRuleDialog
        open={showAddRuleDialog}
        onAddRule={handleAddRule}
        onClose={handleCloseAddRuleDialog}
        unidentifiedBankTransactionId={unidentifiedBankTransactionId}
      />

      <h4>Remaining number of unidentified transactions: {props.unidentifiedBankTransactions.length}</h4>
      <h4>Remaining of unique descriptions: {getUniqueDescriptionsCount(props.unidentifiedBankTransactions)}</h4>
      <h4>Debits: {formatCurrency(debits)}</h4>
      <h4>Credits: {formatCurrency(credits)}</h4>
      <div className="table-container">
        <div className="table-header">
          <div className="table-row">
            <div className="table-cell"></div>
            <div className="table-cell">Transaction Type</div>
            <div className="table-cell">Description</div>
            <div className="table-cell">Date</div>
            <div className="table-cell">Amount</div>
          </div>
        </div>
        <div className="unidentified-report-table-body">
          {props.unidentifiedBankTransactions.map((unidentifiedBankTransaction: BankTransaction) => (
            <div className="table-row" key={unidentifiedBankTransaction.id}>
              <div className="table-cell">
                <IconButton onClick={() => handleButtonClick(unidentifiedBankTransaction)}>
                  <AssignmentIcon />
                </IconButton>
              </div>
              <div className="table-cell">{getTransactionTypeLabel(unidentifiedBankTransaction.bankTransactionType)}</div>
              <div className="table-cell">{getTransactionDetails(unidentifiedBankTransaction)}</div>
              <div className="table-cell">{formatDate(unidentifiedBankTransaction.transactionDate)}</div>
              <div className="table-cell">{formatCurrency(-unidentifiedBankTransaction.amount)}</div>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}

function mapStateToProps(state: any) {
  return {
    startDate: getStartDate(state),
    endDate: getEndDate(state),
    unidentifiedBankTransactions: getUnidentifiedBankTransactions(state),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
    onAddCategory: addCategoryServerAndRedux,
    onAddCategoryAssignmentRule: addCategoryAssignmentRuleServerAndRedux,
    onSearch: search,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(UnIdentifiedTransactionTable);

