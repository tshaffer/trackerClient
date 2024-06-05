export interface CategoryEntity {
  id: string;
  keyword: string;
}

export interface TransactionEntity {
  id: string;
  statementId: string;
  transactionDate: string;
  amount: number;
  description: string;
  category: string;
}

export interface CategorizedStatementData {
  startDate: string;
  endDate: string;
  transactions: TransactionEntity[];
  total: number;
}

export type CategoryExpensesData = {
  id: string;
  categoryName: string;
  transactions: TransactionEntity[];
  transactionCount: number,
  totalExpenses: number,
  percentageOfTotal: number,
}

