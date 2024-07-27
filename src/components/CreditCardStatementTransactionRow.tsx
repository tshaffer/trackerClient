import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TrackerDispatch } from '../models';
import { Category, CreditCardTransaction } from '../types';
import { getTransactionById, getTransactionCategoryFromCategoryAssignmentRule } from '../selectors';
import { formatCurrency, formatDate } from '../utilities';

import '../styles/Grid.css';

export interface CreditCardStatementPropsFromParent {
  creditCardTransactionId: string;
}

export interface CreditCardStatementProps {
  creditCardTransaction: CreditCardTransaction;
  categoryFromCategoryAssignmentRule: Category | null;
}

const CreditCardStatementTransactionRow: React.FC<CreditCardStatementProps> = (props: CreditCardStatementProps) => {

  const getCategoryLabelFromCategoryAssignmentRule = (): string => {
    if (props.categoryFromCategoryAssignmentRule) {
      return props.categoryFromCategoryAssignmentRule.name;
    }
    return '';
  }

  return (
    <React.Fragment>
      <div className="grid-table-cell"></div>
      <div className="grid-table-cell">{formatDate(props.creditCardTransaction.transactionDate)}</div>
      <div className="grid-table-cell">{formatCurrency(props.creditCardTransaction.amount)}</div>
      <div className="grid-table-cell">{props.creditCardTransaction.description}</div>
      <div className="grid-table-cell">{props.creditCardTransaction.category}</div>
      <div className="grid-table-cell">{getCategoryLabelFromCategoryAssignmentRule()}</div>
    </React.Fragment>
  );
}

function mapStateToProps(state: any, ownProps: CreditCardStatementPropsFromParent) {
  const creditCardTransaction:CreditCardTransaction =  getTransactionById(state, ownProps.creditCardTransactionId) as CreditCardTransaction;
  return {
    creditCardTransaction,
    categoryFromCategoryAssignmentRule: getTransactionCategoryFromCategoryAssignmentRule(state, creditCardTransaction),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CreditCardStatementTransactionRow);
