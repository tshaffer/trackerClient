import React from 'react';

import '../styles/Tracker.css';
import { BankTransactionEntity, BankTransactionType, CheckingAccountTransactionEntity, CreditCardTransactionEntity } from '../types';
import { formatCurrency, formatDate } from '../utilities';
import { Button } from '@mui/material';

interface UnidentifiedTransactionsTableProps {
  unidentifiedBankTransactions: BankTransactionEntity[];
}

const UnidentifiedTransactionsTable: React.FC<UnidentifiedTransactionsTableProps> = (props: UnidentifiedTransactionsTableProps) => {

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

  return (
    <React.Fragment>
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
                <Button>Add Rule</Button>
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

export default UnidentifiedTransactionsTable;
