import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SafetyDividerIcon from '@mui/icons-material/SafetyDivider';


import { TrackerDispatch } from '../models';
import { Category, CreditCardTransaction } from '../types';
import { getTransactionById, findMatchingRule, MatchingRuleAssignment } from '../selectors';
import { formatCurrency, formatDate } from '../utilities';

import '../styles/Grid.css';
import { Tooltip, IconButton } from '@mui/material';

export interface CreditCardStatementPropsFromParent {
  creditCardTransactionId: string;
}

export interface CreditCardStatementProps {
  creditCardTransaction: CreditCardTransaction;
  categoryNameFromCategoryAssignmentRule: string;
  patternFromCategoryAssignmentRule: string | null;
}

const CreditCardStatementTransactionRow: React.FC<CreditCardStatementProps> = (props: CreditCardStatementProps) => {

  function handleSplitTransaction(): void {
    console.log('Split Transaction', props.creditCardTransaction.id);
  }

  return (
    <React.Fragment>
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
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CreditCardStatementTransactionRow);
