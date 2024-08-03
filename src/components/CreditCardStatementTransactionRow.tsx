import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { v4 as uuidv4 } from 'uuid';

import AssignmentIcon from '@mui/icons-material/Assignment';
import EditIcon from '@mui/icons-material/Edit';

import { TrackerDispatch } from '../models';
import { CategoryAssignmentRule, CreditCardTransaction, Transaction } from '../types';
import { getTransactionById, findMatchingRule, MatchingRuleAssignment, categorizeTransaction, getCategories, getCategoryAssignmentRules, getCategoryById, getOverrideCategory, getOverrideCategoryId } from '../selectors';
import { formatCurrency, formatDate } from '../utilities';

import '../styles/Grid.css';
import { Tooltip, IconButton } from '@mui/material';
import AddCategoryAssignmentRuleDialog from './AddCategoryAssignmentRuleDialog';
import { addCategoryAssignmentRuleServerAndRedux, updateTransaction } from '../controllers';
import EditTransactionDialog from './EditTransactionDialog';

export interface CreditCardStatementPropsFromParent {
  creditCardTransactionId: string;
}

export interface CreditCardStatementProps {
  creditCardTransaction: CreditCardTransaction;
  categoryNameFromCategoryAssignmentRule: string;
  patternFromCategoryAssignmentRule: string | null;
  categoryNameFromCategoryOverride: string;
  categorizedTransactionName: string;
  onUpdateTransaction: (transaction: Transaction) => any;
  onAddCategoryAssignmentRule: (categoryAssignmentRule: CategoryAssignmentRule) => any;
}

const CreditCardStatementTransactionRow: React.FC<CreditCardStatementProps> = (props: CreditCardStatementProps) => {

  const [transactionId, setTransactionId] = React.useState('');
  const [showAddCategoryAssignmentRuleDialog, setShowAddCategoryAssignmentRuleDialog] = React.useState(false);
  const [showEditTransactionDialog, setShowEditTransactionDialog] = React.useState(false);

  const handleEditTransaction = () => {
    setShowEditTransactionDialog(true);
  };

  const handleSaveTransaction = (transaction: Transaction) => {
    props.onUpdateTransaction(transaction);
  };

  const handleCloseEditTransactionDialog = () => {
    setShowEditTransactionDialog(false);
  }


  const handleEditRule = (transaction: CreditCardTransaction) => {
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

  const renderEditIcon = (): JSX.Element => {
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

  return (
    <React.Fragment>
      <AddCategoryAssignmentRuleDialog
        open={showAddCategoryAssignmentRuleDialog}
        transactionId={transactionId}
        onClose={handleCloseAddRuleDialog}
        onSaveRule={handleSaveRule}
      />
      <EditTransactionDialog
        open={showEditTransactionDialog}
        transactionId={props.creditCardTransaction.id}
        onClose={handleCloseEditTransactionDialog}
        onSave={handleSaveTransaction}
      />

      <div className="grid-table-cell"></div>
      <div className="grid-table-cell">{formatDate(props.creditCardTransaction.transactionDate)}</div>
      <div className="grid-table-cell">{formatCurrency(props.creditCardTransaction.amount)}</div>
      <div className="grid-table-cell">{props.creditCardTransaction.description}</div>
      {renderEditIcon()}
      <div className="grid-table-cell">{props.creditCardTransaction.userDescription}</div>
      <div className="grid-table-cell">{props.categorizedTransactionName}</div>
      <div className="grid-table-cell">{props.creditCardTransaction.category}</div>
      <Tooltip title="Edit rule">
        <IconButton onClick={() => handleEditRule(props.creditCardTransaction)}>
          <AssignmentIcon />
        </IconButton>
      </Tooltip>
      <div className="grid-table-cell">{props.categoryNameFromCategoryAssignmentRule}</div>
      <div className="grid-table-cell">{props.patternFromCategoryAssignmentRule}</div>
      <div className="grid-table-cell">{props.categoryNameFromCategoryOverride}</div>
    </React.Fragment>
  );
}

function mapStateToProps(state: any, ownProps: CreditCardStatementPropsFromParent) {
  const creditCardTransaction: CreditCardTransaction = getTransactionById(state, ownProps.creditCardTransactionId) as CreditCardTransaction;
  const matchingRule: MatchingRuleAssignment | null = findMatchingRule(state, creditCardTransaction);
  return {
    creditCardTransaction,
    categoryNameFromCategoryAssignmentRule: matchingRule ? matchingRule.category.name : '',
    patternFromCategoryAssignmentRule: matchingRule ? matchingRule.pattern : '',
    categoryNameFromCategoryOverride: getOverrideCategory(state, ownProps.creditCardTransactionId)
      ? getCategoryById(state, getOverrideCategoryId(state, ownProps.creditCardTransactionId))!.name
      : '',
    categorizedTransactionName: categorizeTransaction(creditCardTransaction, getCategories(state), getCategoryAssignmentRules(state))?.name || '',
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
    onAddCategoryAssignmentRule: addCategoryAssignmentRuleServerAndRedux,
    onUpdateTransaction: updateTransaction,

  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CreditCardStatementTransactionRow);
