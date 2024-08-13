import React from 'react';
import { useParams } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { getCreditCardStatementById } from '../selectors';

const CheckingAccountStatementDetails: React.FC = () => {
  // Retrieve the 'id' parameter from the URL
  const { id } = useParams<{ id: string }>();

  // Use the selector to fetch the statement details from the Redux store
  // const statement = useSelector(state => getCreditCardStatementById(state, id));

  const statement: any = {
    id: 1,
    statementDate: '2021-01-01',
    totalAmount: 1000,
    transactions: [
      { id: 1, date: '2021-01-01', description: 'Groceries', amount: 100 },
      { id: 2, date: '2021-01-02', description: 'Dinner', amount: 50 },
      { id: 3, date: '2021-01-03', description: 'Gas', amount: 30 },
    ],
  };

  if (!statement) {
    return <div>Statement not found</div>;
  }

  return (
    <div>
      <h2>Credit Card Statement Details</h2>
      <p><strong>Statement ID:</strong> {statement.id}</p>
      <p><strong>Statement Date:</strong> {statement.statementDate}</p>
      <p><strong>Total Amount:</strong> {statement.totalAmount}</p>
      <h3>Transactions</h3>
      <ul>
        {statement.transactions.map((transaction: any) => (
          <li key={transaction.id}>
            {transaction.date} - {transaction.description} - {transaction.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CheckingAccountStatementDetails;