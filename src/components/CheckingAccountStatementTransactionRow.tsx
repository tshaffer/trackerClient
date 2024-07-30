import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { v4 as uuidv4 } from 'uuid';

import SafetyDividerIcon from '@mui/icons-material/SafetyDivider';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EditIcon from '@mui/icons-material/Edit';

import { TrackerDispatch } from '../models';
import { BankTransactionType, CategoryAssignmentRule, CheckTransaction, CheckingAccountTransaction, CheckingAccountTransactionType, SplitTransaction, Transaction } from '../types';
import { getTransactionById, findMatchingRule, MatchingRuleAssignment } from '../selectors';
import { formatCurrency, formatDate } from '../utilities';

import '../styles/Grid.css';
import { Tooltip, IconButton } from '@mui/material';
import AddCategoryAssignmentRuleDialog from './AddCategoryAssignmentRuleDialog';
import { addCategoryAssignmentRuleServerAndRedux, splitTransaction, updateCheckTransaction, updateTransaction } from '../controllers';
import SplitTransactionDialog from './SplitTransactionDialog';
import EditTransactionDialog from './EditTransactionDialog';
import EditCheckDialog from './EditCheckDialog';

export interface CheckingAccountStatementPropsFromParent {
  // checkingAccountTransactionId: string;
  checkingAccountTransaction: CheckingAccountTransaction;
}

export interface CheckingAccountStatementProps extends CheckingAccountStatementPropsFromParent {
  // checkingAccountTransaction: CheckingAccountTransaction;
  categoryNameFromCategoryAssignmentRule: string;
  patternFromCategoryAssignmentRule: string | null;
  onAddCategoryAssignmentRule: (categoryAssignmentRule: CategoryAssignmentRule) => any;
  onSplitTransaction: (parentTransactionId: string, splitTransactions: SplitTransaction[]) => any;
  onUpdateTransaction: (transaction: Transaction) => any;
  onUpdateCheckTransaction: (check: CheckTransaction) => any;
}

const CheckingAccountStatementTransactionRow: React.FC<CheckingAccountStatementProps> = (props: CheckingAccountStatementProps) => {

  const [transactionId, setTransactionId] = React.useState('');
  const [showSplitTransactionDialog, setShowSplitTransactionDialog] = React.useState(false);
  const [showAddCategoryAssignmentRuleDialog, setShowAddCategoryAssignmentRuleDialog] = React.useState(false);
  const [showEditTransactionDialog, setShowEditTransactionDialog] = React.useState(false);
  const [showEditCheckDialog, setShowEditCheckDialog] = React.useState(false);

  console.log('checkingAccountTransaction: ', props.checkingAccountTransaction.isSplit.toString());

  function handleSplitTransaction(): void {
    console.log('Split Transaction', props.checkingAccountTransaction.id);
    setShowSplitTransactionDialog(true);
  }

  const handleEditRule = (transaction: CheckingAccountTransaction) => {
    setTransactionId(transaction.id);
    setShowAddCategoryAssignmentRuleDialog(true);
  };

  const handleEditCheck = () => {
    setShowEditCheckDialog(true);
  };

  const handleSaveCheck = (check: CheckTransaction) => {
    props.onUpdateCheckTransaction(check);
  };

  const handleCloseEditCheckDialog = () => {
    setShowEditCheckDialog(false);
  }

  const handleEditTransaction = () => {
    setShowEditTransactionDialog(true);
  };

  const handleSaveTransaction = (transaction: Transaction) => {
    props.onUpdateTransaction(transaction);
  };

  const handleCloseEditTransactionDialog = () => {
    setShowEditTransactionDialog(false);
  }

  const handleSaveRule = (pattern: string, categoryId: string): void => {
    const id: string = uuidv4();
    const categoryAssignmentRule: CategoryAssignmentRule = {
      id,
      pattern,
      categoryId
    };
    console.log('handleSaveRule: ', categoryAssignmentRule, categoryAssignmentRule);
    props.onAddCategoryAssignmentRule(categoryAssignmentRule);
  }

  const handleCloseAddRuleDialog = () => {
    setShowAddCategoryAssignmentRuleDialog(false);
  }

  const handleSaveSplitTransaction = (splitTransactions: SplitTransaction[]): void => {
    console.log('handleSaveSplitTransaction: ', splitTransactions);
    splitTransactions.forEach((splitTransaction, index) => {
      splitTransaction.parentTransactionId = props.checkingAccountTransaction.id;
      splitTransaction.id = uuidv4();
    });

    props.onSplitTransaction(props.checkingAccountTransaction.id, splitTransactions);
  }

  const handleCloseAddSplitTransactionDialog = () => {
    setShowSplitTransactionDialog(false);
  }

  const renderEditIcon = (): JSX.Element => {
    if (props.checkingAccountTransaction.bankTransactionType === BankTransactionType.Checking) {
      if ((props.checkingAccountTransaction as CheckingAccountTransaction).checkingAccountTransactionType === CheckingAccountTransactionType.Check) {
        return (
          <div className="grid-table-cell">
            <Tooltip title="Set check number and payee">
              <IconButton onClick={() => handleEditCheck()}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          </div>
        );
      }
    }
    return (
      <div className="grid-table-cell">
        <Tooltip title="Edit transaction">
          <IconButton onClick={() => handleEditTransaction()}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      </div>
    );
  }

  const renderEditCheckDialog = (): JSX.Element | null => {
    if (showEditCheckDialog) {
      return (
        <EditCheckDialog
          open={showEditCheckDialog}
          unidentifiedBankTransactionId={props.checkingAccountTransaction.id}
          onClose={handleCloseEditCheckDialog}
          onSave={handleSaveCheck}
        />
      );
    }
    return null;
  }

  console.log('render CheckingAccountStatementTransactionRow', props.checkingAccountTransaction);

  return (
    <React.Fragment>
      <SplitTransactionDialog
        open={showSplitTransactionDialog}
        transactionId={transactionId}
        onClose={handleCloseAddSplitTransactionDialog}
        onSave={handleSaveSplitTransaction}
      />
      <AddCategoryAssignmentRuleDialog
        open={showAddCategoryAssignmentRuleDialog}
        transactionId={transactionId}
        onClose={handleCloseAddRuleDialog}
        onSaveRule={handleSaveRule}
      />
      {renderEditCheckDialog()}
      <EditTransactionDialog
        open={showEditTransactionDialog}
        transactionId={props.checkingAccountTransaction.id}
        onClose={handleCloseEditTransactionDialog}
        onSave={handleSaveTransaction}
      />

      <div className="grid-table-cell" style={{ marginLeft: '32px' }}>
        <Tooltip title="Split Transaction" arrow>
          <IconButton onClick={handleSplitTransaction}>
            <SafetyDividerIcon />
          </IconButton>
        </Tooltip>
      </div>
      <div className="grid-table-cell">{formatDate(props.checkingAccountTransaction.transactionDate)}</div>
      <div className="grid-table-cell">{formatCurrency(props.checkingAccountTransaction.amount)}</div>
      <div className="grid-table-cell">{props.checkingAccountTransaction.name}</div>
      {renderEditIcon()}
      <div className="grid-table-cell">{props.checkingAccountTransaction.userDescription}</div>
      <div className="grid-table-cell">
        <Tooltip title="Edit rule">
          <IconButton onClick={() => handleEditRule(props.checkingAccountTransaction)}>
            <AssignmentIcon />
          </IconButton>
        </Tooltip>
      </div>
      <div className="grid-table-cell">{props.categoryNameFromCategoryAssignmentRule}</div>
      <div className="grid-table-cell">{props.patternFromCategoryAssignmentRule}</div>
    </React.Fragment>
  );
}

function mapStateToProps(state: any, ownProps: CheckingAccountStatementPropsFromParent) {
  // const checkingAccountTransaction: CheckingAccountTransaction = getTransactionById(state, ownProps.checkingAccountTransactionId) as CheckingAccountTransaction;
  const matchingRule: MatchingRuleAssignment | null = findMatchingRule(state, ownProps.checkingAccountTransaction);
  return {
    // checkingAccountTransaction: ownProps.checkingAccountTransaction,
    categoryNameFromCategoryAssignmentRule: matchingRule ? matchingRule.category.name : '',
    patternFromCategoryAssignmentRule: matchingRule ? matchingRule.pattern : '',
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
    onAddCategoryAssignmentRule: addCategoryAssignmentRuleServerAndRedux,
    onSplitTransaction: splitTransaction,
    onUpdateTransaction: updateTransaction,
    onUpdateCheckTransaction: updateCheckTransaction,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckingAccountStatementTransactionRow);
