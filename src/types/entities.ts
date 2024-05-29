export interface Category {
  id: string;
  keyword: string;
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

export interface TransactionsDataResponseItem {
  category: Category;
  transaction: CreditCardTransactionEntity;
}

export interface CategorizedStatementData {
  startDate: string;
  endDate: string;
  transactions: CategorizedTransactionEntity[];
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

