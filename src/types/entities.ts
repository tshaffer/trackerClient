import { BankTransactionType, CheckingAccountTransactionType, DisregardLevel, StatementType } from "./enums";

export interface CategorizedStatementData {
  startDate: string;
  endDate: string;
  transactions: CategorizedTransaction[];
  unidentifiedBankTransactions: BankTransaction[];
  netDebits: number;
}

export interface Transactions {
  creditCardTransactions: CreditCardTransaction[];
  checkingAccountTransactions: CheckingAccountTransaction[];
}

export interface Transaction {
  id: string;
  statementId: string;
  transactionDate: string;
  amount: number;
  bankTransactionType: BankTransactionType;
  userDescription: string;
}

export interface CreditCardTransaction extends Transaction {
  postDate: string;
  category: string;
  description: string;
  type: string;
}

export interface CheckingAccountTransaction extends Transaction {
  transactionType: string;
  name: string;
  memo: string;
  checkingAccountTransactionType: CheckingAccountTransactionType;
}

export interface CheckTransaction extends CheckingAccountTransaction {
  checkNumber: string;
  payee: string;
}

export type BankTransaction = CreditCardTransaction | CheckingAccountTransaction;

export interface CategorizedTransaction {
  bankTransaction: BankTransaction;
  categoryId: string;
}

export interface Statement {
  id: string;
  fileName: string;
  type: StatementType;
  startDate: string;
  endDate: string;
  transactionCount: number;
  netDebits: number;
}

export type CreditCardStatement = Statement

export interface CheckingAccountStatement extends Statement {
  checkCount: number;
  atmWithdrawalCount: number;
}

export interface Category {
  id: string
  name: string;
  disregardLevel: DisregardLevel;
}

export interface CategoryAssignmentRule {
  id: string;
  pattern: string;
  categoryId: string;
}

export interface ReviewedTransactions {
  categorizedTransactions: CategorizedTransaction[];
  ignoredTransactions: BankTransaction[];
  uncategorizedTransactions: BankTransaction[]
}

export interface MinMaxDates {
  minDate: string;
  maxDate: string;
}

export interface Category {
  id: string;
  name: string;
  parentId: string;
  disregardLevel: DisregardLevel;
}

export interface CategoryAssignmentRule {
  id: string;
  pattern: string;
  categoryId: string;
}

export type CategoryExpensesData = {
  id: string;
  categoryName: string;
  transactions: CategorizedTransaction[];
  transactionCount: number,
  totalExpenses: number,
  percentageOfTotal: number,
}

export interface CategoryMenuItem extends Category {
  children: CategoryMenuItem[];
  level: number;
}

export type StringToCategoryMenuItemLUT = {
  [key: string]: CategoryMenuItem;
}

