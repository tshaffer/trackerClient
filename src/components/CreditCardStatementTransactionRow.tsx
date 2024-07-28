import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { v4 as uuidv4 } from 'uuid';

import SafetyDividerIcon from '@mui/icons-material/SafetyDivider';
import AssignmentIcon from '@mui/icons-material/Assignment';

import { TrackerDispatch } from '../models';
import { CategoryAssignmentRule, CreditCardTransaction, Transaction } from '../types';
import { getTransactionById, findMatchingRule, MatchingRuleAssignment } from '../selectors';
import { formatCurrency, formatDate } from '../utilities';

import '../styles/Grid.css';
import { Tooltip, IconButton } from '@mui/material';
import AddCategoryAssignmentRuleDialog from './AddCategoryAssignmentRuleDialog';
import { addCategoryAssignmentRuleServerAndRedux } from '../controllers';

export interface CreditCardStatementPropsFromParent {
  creditCardTransactionId: string;
}

export interface CreditCardStatementProps {
  creditCardTransaction: CreditCardTransaction;
  categoryNameFromCategoryAssignmentRule: string;
  patternFromCategoryAssignmentRule: string | null;
  onAddCategoryAssignmentRule: (categoryAssignmentRule: CategoryAssignmentRule) => any;
}

const CreditCardStatementTransactionRow: React.FC<CreditCardStatementProps> = (props: CreditCardStatementProps) => {

  const [transactionId, setTransactionId] = React.useState('');
  const [showAddCategoryAssignmentRuleDialog, setShowAddCategoryAssignmentRuleDialog] = React.useState(false);

  function handleSplitTransaction(): void {
    console.log('Split Transaction', props.creditCardTransaction.id);
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

  return (
    <React.Fragment>
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
      <div className="grid-table-cell">{formatDate(props.creditCardTransaction.transactionDate)}</div>
      <div className="grid-table-cell">{formatCurrency(props.creditCardTransaction.amount)}</div>
      <div className="grid-table-cell">{props.creditCardTransaction.description}</div>
      <div className="grid-table-cell">{props.creditCardTransaction.category}</div>
      <Tooltip title="Edit rule">
        <IconButton onClick={() => handleEditRule(props.creditCardTransaction)}>
          <AssignmentIcon />
        </IconButton>
      </Tooltip>
      <div className="grid-table-cell">{props.categoryNameFromCategoryAssignmentRule}</div>
      <div className="grid-table-cell">{props.patternFromCategoryAssignmentRule}</div>
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
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
    onAddCategoryAssignmentRule: addCategoryAssignmentRuleServerAndRedux,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CreditCardStatementTransactionRow);
