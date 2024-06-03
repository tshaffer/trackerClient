export interface Category {
  id: string;
  keyword: string;
}

export interface CheckingAccountTransactionEntity {
  id: string;
  statementId: string;
  transactionDate: string;
  transactionType: string;
  name: string;
  memo: string;
  amount: number;
}


export interface CreditCardTransactionEntity {
  id: string;
  statementId: string;
  transactionDate: string;
  postDate: string;
  description: string;
  category: string;
  type: string;
  amount: number;
}

export interface TransactionEntity {
  id: string;
  statementId: string;
  transactionDate: string;
  amount: number;
  description: string;
  category: string;
}

export interface TransactionsDataResponseItem {
  category: Category;
  transaction: TransactionEntity;
}

export interface CategorizedStatementData {
  startDate: string;
  endDate: string;
  transactions: TransactionEntity[];
  total: number;
}

export interface CategorizedTransactionEntity {
  transaction: CreditCardTransactionEntity;
  category: CategoryEntity;
}

export interface CategoryEntity {
  id: string
  keyword: string;
}

export type CategoryExpensesData = {
  id: string;
  categoryName: string;
  transactions: TransactionEntity[];
  transactionCount: number,
  totalExpenses: number,
  percentageOfTotal: number,
}

