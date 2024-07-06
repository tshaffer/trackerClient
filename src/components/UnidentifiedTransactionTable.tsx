import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { v4 as uuidv4 } from 'uuid';

import '../styles/Tracker.css';
import { BankTransaction, BankTransactionType, Category, CategoryAssignmentRule, CheckingAccountTransaction, CheckingAccountTransactionType, CreditCardTransaction, DateRangeType, DisregardLevel, Statement, StatementType } from '../types';
import { formatCurrency, formatDate } from '../utilities';
import { IconButton, Tooltip } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EditIcon from '@mui/icons-material/Edit';
import AddRuleDialog from './AddCategoryAssignmentRuleDialog';
import { addCategoryAssignmentRuleServerAndRedux, addCategoryServerAndRedux, search } from '../controllers';
import { TrackerDispatch } from '../models';
import { getStartDate, getEndDate, getUnidentifiedBankTransactions, getGeneratedReportEndDate, getGeneratedReportStartDate, getDateRangeType, getReportStatement, getReportStatementId } from '../selectors';
import { isNil } from 'lodash';
import EditCheckDialog from './EditCheckDialog';

interface NotIdentifiedTransactionTableProps {
  startDate: string;
  endDate: string;
  dateRangeType: DateRangeType,
  reportStatement: Statement | null,
  generatedReportStartDate: string;
  generatedReportEndDate: string;
  unidentifiedBankTransactions: BankTransaction[];
  onAddCategory: (category: Category) => any;
  onAddCategoryAssignmentRule: (categoryAssignmentRule: CategoryAssignmentRule) => any;
  onSearch: (startDate: string, endDate: string, includeCreditCardTransactions: boolean, includeCheckingAccountTransactions: boolean) => any;
}

const UnIdentifiedTransactionTable: React.FC<NotIdentifiedTransactionTableProps> = (props: NotIdentifiedTransactionTableProps) => {

  const [unidentifiedBankTransactionId, setUnidentifiedBankTransactionId] = React.useState('');
  const [showAddRuleDialog, setShowAddRuleDialog] = React.useState(false);
  const [showEditCheckDialog, setShowEditCheckDialog] = React.useState(false);

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

  const handleAssignCategory = (unidentifiedBankTransaction: BankTransaction) => {
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
        let includeCreditCardTransactions = true;
        let includeCheckingAccountTransactions = true;
        if (props.dateRangeType === DateRangeType.Statement) {
          if (!isNil(props.reportStatement)) {
            includeCreditCardTransactions = props.reportStatement.type === StatementType.CreditCard;
            includeCheckingAccountTransactions = props.reportStatement.type === StatementType.Checking;
          }
        }
        props.onSearch(props.startDate, props.endDate, true, true);
      }
      );
  }

  const handleCloseAddRuleDialog = () => {
    setShowAddRuleDialog(false);
  };

  const handleEditCheck = (unidentifiedBankTransaction: BankTransaction) => {
    console.log('handleEditCheck: ', unidentifiedBankTransaction);
    setUnidentifiedBankTransactionId(unidentifiedBankTransaction.id);
    setShowEditCheckDialog(true);
  };

  const handleSaveCheck = (check: CheckingAccountTransaction) => {
    console.log('handleSaveCheck: ', check);
  };

  const handleCloseEditCheckDialog = () => {
    setShowEditCheckDialog(false);
  }

  const getEditIcon = (unidentifiedBankTransaction: BankTransaction): JSX.Element => {
    if (unidentifiedBankTransaction.bankTransactionType === BankTransactionType.Checking) {
      if ((unidentifiedBankTransaction as CheckingAccountTransaction).checkingAccountTransactionType === CheckingAccountTransactionType.Check) {
        return (
          <Tooltip title="Set check number and payee">
            <IconButton onClick={() => handleEditCheck(unidentifiedBankTransaction)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        );
      }
    }
    return (
      <div style={{ width: 40, height: 40 }}></div>
    );
  }

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
      <EditCheckDialog
        open={showEditCheckDialog}
        unidentifiedBankTransactionId={unidentifiedBankTransactionId}
        onClose={handleCloseEditCheckDialog}
        onSave={handleSaveCheck}
      />

      <h4>Date Range {formatDate(props.generatedReportStartDate)} - {formatDate(props.generatedReportEndDate)}</h4>
      <h4>Remaining number of unidentified transactions: {props.unidentifiedBankTransactions.length}</h4>
      <h4>Remaining of unique descriptions: {getUniqueDescriptionsCount(props.unidentifiedBankTransactions)}</h4>
      <h4>Debits: {formatCurrency(debits)}</h4>
      <h4>Credits: {formatCurrency(credits)}</h4>
      <div className="table-container">
        <div className="table-header">
          <div className="table-row">
            <div className="unidentified-table-cell"></div>
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
                <IconButton onClick={() => handleAssignCategory(unidentifiedBankTransaction)}>
                  <AssignmentIcon />
                </IconButton>
                {getEditIcon(unidentifiedBankTransaction)}
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
    generatedReportStartDate: getGeneratedReportStartDate(state),
    generatedReportEndDate: getGeneratedReportEndDate(state),
    unidentifiedBankTransactions: getUnidentifiedBankTransactions(state),
    dateRangeType: getDateRangeType(state),
    reportStatement: getReportStatement(state, getReportStatementId(state)),
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

