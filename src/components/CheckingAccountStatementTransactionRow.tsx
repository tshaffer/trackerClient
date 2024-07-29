import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { v4 as uuidv4 } from 'uuid';

import SafetyDividerIcon from '@mui/icons-material/SafetyDivider';
import AssignmentIcon from '@mui/icons-material/Assignment';

import { TrackerDispatch, setSplitTransaction } from '../models';
import { CategoryAssignmentRule, CheckingAccountTransaction, SplitTransaction } from '../types';
import { getTransactionById, findMatchingRule, MatchingRuleAssignment } from '../selectors';
import { formatCurrency, formatDate } from '../utilities';

import '../styles/Grid.css';
import { Tooltip, IconButton } from '@mui/material';
import AddCategoryAssignmentRuleDialog from './AddCategoryAssignmentRuleDialog';
import { addCategoryAssignmentRuleServerAndRedux } from '../controllers';
import SplitTransactionDialog from './SplitTransactionDialog';
import { uuid } from 'uuidv4';

export interface CheckingAccountStatementPropsFromParent {
  checkingAccountTransactionId: string;
}

export interface CheckingAccountStatementProps {
  checkingAccountTransaction: CheckingAccountTransaction;
  categoryNameFromCategoryAssignmentRule: string;
  patternFromCategoryAssignmentRule: string | null;
  onAddCategoryAssignmentRule: (categoryAssignmentRule: CategoryAssignmentRule) => any;
  onSetSplitTransaction: (parentTransactionId: string, splitTransactions: SplitTransaction[]) => any;
}

const CheckingAccountStatementTransactionRow: React.FC<CheckingAccountStatementProps> = (props: CheckingAccountStatementProps) => {

  const [transactionId, setTransactionId] = React.useState('');
  const [showSplitTransactionDialog, setShowSplitTransactionDialog] = React.useState(false);
  const [showAddCategoryAssignmentRuleDialog, setShowAddCategoryAssignmentRuleDialog] = React.useState(false);

  console.log('checkingAccountTransaction: ', props.checkingAccountTransaction.isSplit.toString());

  function handleSplitTransaction(): void {
    console.log('Split Transaction', props.checkingAccountTransaction.id);
    setShowSplitTransactionDialog(true);
  }

  const handleEditRule = (transaction: CheckingAccountTransaction) => {
    setTransactionId(transaction.id);
    setShowAddCategoryAssignmentRuleDialog(true);
  };

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

    props.onSetSplitTransaction(props.checkingAccountTransaction.id, splitTransactions);
  }

  const handleCloseAddSplitTransactionDialog = () => {
    setShowSplitTransactionDialog(false);
  }

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
      <Tooltip title="Edit rule">
        <IconButton onClick={() => handleEditRule(props.checkingAccountTransaction)}>
          <AssignmentIcon />
        </IconButton>
      </Tooltip>
      <div className="grid-table-cell">{props.categoryNameFromCategoryAssignmentRule}</div>
      <div className="grid-table-cell">{props.patternFromCategoryAssignmentRule}</div>
    </React.Fragment>
  );
}

function mapStateToProps(state: any, ownProps: CheckingAccountStatementPropsFromParent) {
  const checkingAccountTransaction: CheckingAccountTransaction = getTransactionById(state, ownProps.checkingAccountTransactionId) as CheckingAccountTransaction;
  const matchingRule: MatchingRuleAssignment | null = findMatchingRule(state, checkingAccountTransaction);
  return {
    checkingAccountTransaction,
    categoryNameFromCategoryAssignmentRule: matchingRule ? matchingRule.category.name : '',
    patternFromCategoryAssignmentRule: matchingRule ? matchingRule.pattern : '',
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
    onAddCategoryAssignmentRule: addCategoryAssignmentRuleServerAndRedux,
    onSetSplitTransaction: setSplitTransaction,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckingAccountStatementTransactionRow);
