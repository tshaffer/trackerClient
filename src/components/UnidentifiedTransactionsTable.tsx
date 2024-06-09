import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { v4 as uuidv4 } from 'uuid';

import '../styles/Tracker.css';
import { BankTransactionEntity, BankTransactionType, CategoryKeywordEntity, CheckingAccountTransactionEntity, CreditCardTransactionEntity } from '../types';
import { formatCurrency, formatDate } from '../utilities';
import { IconButton } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddRuleDialog from './AddRuleDialog';
import { addCategoryKeywordServerAndRedux, search } from '../controllers';
import { TrackerDispatch } from '../models';

interface UnidentifiedTransactionsTableProps {
  unidentifiedBankTransactions: BankTransactionEntity[];
  startDate: string;
  endDate: string;
  onAddCategoryKeyword: (categoryKeywordEntity: CategoryKeywordEntity) => any;
  onSearch: (startDate: string, endDate: string) => any;
}

const UnidentifiedTransactionsTable: React.FC<UnidentifiedTransactionsTableProps> = (props: UnidentifiedTransactionsTableProps) => {

  const [unidentifiedBankTransactionId, setUnidentifiedBankTransactionId] = React.useState('');
  const [showAddRuleDialog, setShowAddRuleDialog] = React.useState(false);

  const getTransactionTypeLabel = (bankTransactionType: BankTransactionType): string => {
    if (bankTransactionType === BankTransactionType.CreditCard) {
      return 'Credit Card';
    } else {
      return 'Checking Account';
    }
  }

  const getTransactionDetails = (bankTransactionEntity: BankTransactionEntity): string => {
    if (bankTransactionEntity.bankTransactionType === BankTransactionType.CreditCard) {
      return (bankTransactionEntity as CreditCardTransactionEntity).description;
    } else {
      return (bankTransactionEntity as CheckingAccountTransactionEntity).name;
    }
  }

  const handleButtonClick = (unidentifiedBankTransaction: BankTransactionEntity) => {
    setUnidentifiedBankTransactionId(unidentifiedBankTransaction.id);
    setShowAddRuleDialog(true);
  };

  const handleAddRule = (categoryKeyword: string, categoryId: string): void => {
    const id: string = uuidv4();
    const categoryKeywordEntity: CategoryKeywordEntity = {
      id,
      keyword: categoryKeyword,
      categoryId
    };
    console.log('handleAddRule: ', categoryKeyword, categoryKeywordEntity);
    props.onAddCategoryKeyword(categoryKeywordEntity)
      .then(() => {
        props.onSearch(props.startDate, props.endDate);
      }
    );
  }

  const handleCloseAddRuleDialog = () => {
    setShowAddRuleDialog(false);
  };

  return (
    <React.Fragment>
      <AddRuleDialog
        open={showAddRuleDialog}
        onAddRule={handleAddRule}
        onClose={handleCloseAddRuleDialog}
        unidentifiedBankTransactionId={unidentifiedBankTransactionId}
      />

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
        <div className="table-body">
          {props.unidentifiedBankTransactions.map((unidentifiedBankTransaction: BankTransactionEntity) => (
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
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
    onAddCategoryKeyword: addCategoryKeywordServerAndRedux,
    onSearch: search,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(UnidentifiedTransactionsTable);

