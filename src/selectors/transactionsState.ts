import { isNil } from 'lodash';
import { BankTransaction, BankTransactionType, CategorizedStatementData, CategorizedTransaction, Category, CategoryAssignmentRule, CheckingAccountTransaction, CreditCardTransaction, DisregardLevel, ReviewedTransactions, StringToTransactionsLUT, TrackerState, Transaction } from '../types';
import { getCategories, getCategoryAssignmentRules, getCategoryById, getCategoryByName } from './categoryState';
import { getEndDate, getStartDate } from './reportDataState';
import { roundTo } from '../utilities';

export const getTransactionIds = (state: TrackerState): string[] => {
  return state.transactionsState.allIds;
};

export const getTransactions = (state: TrackerState): Transaction[] => {
  return getTransactionIds(state).map((id) => state.transactionsState.byId[id]);
}

export const getTransactionById = (state: TrackerState, id: string): Transaction | undefined => {
  return state.transactionsState.byId[id];
};

export const getTransactionsByStatementId = (state: TrackerState, statementId: string): Transaction[] => {
  return getTransactions(state).filter((transaction) => transaction.statementId === statementId);
}

export const getTransactionsByCategory = (state: TrackerState): StringToTransactionsLUT => {

  const categorizedStatementData: CategorizedStatementData = doGetTransactionsByCategory(state);
  const { transactions } = categorizedStatementData;

  const transactionsByCategoryId: StringToTransactionsLUT = {};
  transactions.forEach((transaction: CategorizedTransaction) => {
    const categoryId: string = transaction.categoryId;
    if (!transactionsByCategoryId[categoryId]) {
      transactionsByCategoryId[categoryId] = [];
    }
    transactionsByCategoryId[categoryId].push(transaction);
  });

  return transactionsByCategoryId;
}

export const getUnidentifiedBankTransactions = (state: TrackerState): BankTransaction[] => {
  const categorizedStatementData: CategorizedStatementData = doGetTransactionsByCategory(state);
  const { unidentifiedBankTransactions } = categorizedStatementData;
  return unidentifiedBankTransactions;
}

export const getFixedExpensesByCategory = (state: TrackerState): StringToTransactionsLUT => {
  
  const categorizedStatementData: CategorizedStatementData = doGetTransactionsByCategory(state);
  const { fixedExpenses } = categorizedStatementData;

  const fixedExpensesByCategoryId: StringToTransactionsLUT = {};
  fixedExpenses.forEach((fixedExpenseTransaction: CategorizedTransaction) => {
    const categoryId: string = fixedExpenseTransaction.categoryId;
    if (!fixedExpensesByCategoryId[categoryId]) {
      fixedExpensesByCategoryId[categoryId] = [];
    }
    fixedExpensesByCategoryId[categoryId].push(fixedExpenseTransaction);
  });

  return fixedExpensesByCategoryId;
}

export const doGetTransactionsByCategory = (state: TrackerState): CategorizedStatementData => {

  const allCategories: Category[] = getCategories(state);
  const categories: Category[] = [];
  for (const category of allCategories) {
    if (category.disregardLevel === DisregardLevel.None) {
      categories.push(category);
    }
  }

  const ignoreCategory: Category = getCategoryByName(state, 'Ignore') as Category;
  const categoryAssignmentRules = getCategoryAssignmentRules(state);

  const allTransactions: BankTransaction[] = getTransactions(state) as BankTransaction[];

  const reviewedTransactionEntities: ReviewedTransactions = categorizeTransactions(allTransactions, categories, ignoreCategory, categoryAssignmentRules);

  const categorizedTransactions: CategorizedTransaction[] = reviewedTransactionEntities.categorizedTransactions;
  const unidentifiedBankTransactions: BankTransaction[] = reviewedTransactionEntities.uncategorizedTransactions;
  const fixedExpenses: CategorizedTransaction[] = reviewedTransactionEntities.fixedExpenses

  const transactions: CategorizedTransaction[] = [];
  let sum = 0;

  for (const categorizedTransaction of categorizedTransactions) {
    const transaction: CategorizedTransaction = {
      bankTransaction: categorizedTransaction.bankTransaction,
      categoryId: categorizedTransaction.categoryId,
    };
    transactions.push(transaction);
    sum += transaction.bankTransaction.amount;
  }

  sum = roundTo(-sum, 2)

  const categorizedStatementData: CategorizedStatementData = {
    startDate: getStartDate(state),
    endDate: getEndDate(state),
    transactions,
    netDebits: sum,
    unidentifiedBankTransactions,
    fixedExpenses,
  };

  return categorizedStatementData;
}

const categorizeTransactions = (
  transactions: BankTransaction[],
  categories: Category[],
  ignoreCategory: Category,
  categoryAssignmentRules: CategoryAssignmentRule[]
): ReviewedTransactions => {

  const categorizedTransactions: CategorizedTransaction[] = [];
  const uncategorizedTransactions: BankTransaction[] = [];
  const ignoredTransactions: BankTransaction[] = [];
  const fixedExpenses: CategorizedTransaction[] = [];

  let sum: number = 0;

  for (const transaction of transactions) {
    const category: Category | null = categorizeTransaction(transaction, categories, categoryAssignmentRules);
    if (!isNil(category)) {
      if (category.id === ignoreCategory.id) {
        ignoredTransactions.push(transaction);
      } else {
        const categorizedTransaction: CategorizedTransaction = {
          bankTransaction: transaction,
          categoryId: category.id,
        };
        categorizedTransactions.push(categorizedTransaction);

        if (category.transactionsRequired) {
          fixedExpenses.push(categorizedTransaction);
        }

        sum += transaction.amount;
      }
    } else {
      uncategorizedTransactions.push(transaction);
    }
  }

  return {
    categorizedTransactions,
    uncategorizedTransactions,
    ignoredTransactions,
    fixedExpenses,
  };
};

const categorizeTransaction = (
  transaction: BankTransaction,
  categories: Category[],
  categoryAssignmentRules: CategoryAssignmentRule[]): Category | null => {

  if (transaction.overrideCategory && transaction.overrideCategoryId !== '') {
    for (const category of categories) {
      if (category.id === transaction.overrideCategoryId) {
        return category;
      }
    }
  }

  for (const categoryAssignmentRule of categoryAssignmentRules) {
    if (transaction.userDescription.includes(categoryAssignmentRule.pattern)) {
      const categoryId = categoryAssignmentRule.categoryId;
      for (const category of categories) {
        if (category.id === categoryId) {
          return category;
        }
      }
    }
  }

  if (transaction.bankTransactionType === BankTransactionType.CreditCard) {
    if (!isNil((transaction as unknown as CreditCardTransaction).category)) {
      for (const category of categories) {
        if ((transaction as unknown as CreditCardTransaction).category === category.name) {
          return category;
        }
      }
    }
  }

  return null;
};

export const my_getCategoryByTransactionId = (state: TrackerState, transactionId: string): Category | null | undefined => {

  const transactionsByCategory: StringToTransactionsLUT = getTransactionsByCategory(state);
  for (const categoryId in transactionsByCategory) {
    if (Object.prototype.hasOwnProperty.call(transactionsByCategory, categoryId)) {
      const categorizedTransactions: CategorizedTransaction[] = transactionsByCategory[categoryId];
      for (const categorizedTransaction of categorizedTransactions) {
        if (categorizedTransaction.bankTransaction.id === transactionId) {
          return getCategoryById(state, categoryId);
        }
      }
    }
  }
  return null;
}

export const getCategoryByTransactionId = (state: TrackerState, transactionId: string): Category | null | undefined => {

  const transactionsByCategory: StringToTransactionsLUT = getTransactionsByCategory(state);

  for (const categoryId in transactionsByCategory) {
    if (Object.prototype.hasOwnProperty.call(transactionsByCategory, categoryId)) {
      const categorizedTransaction = transactionsByCategory[categoryId].find(transaction => transaction.bankTransaction.id === transactionId);
      if (categorizedTransaction) {
        return getCategoryById(state, categoryId);
      }
    }
  }
  return null;
};

export const getOverrideCategory = (state: TrackerState, transactionId: string): boolean => {
  const transaction = getTransactionById(state, transactionId);
  return transaction?.overrideCategory ?? false;
}

export const getOverrideCategoryId = (state: TrackerState, transactionId: string): string => {
  const transaction = getTransactionById(state, transactionId);
  if (!isNil(transaction)) {
    if (transaction.overrideCategory) {
      return transaction.overrideCategoryId;
    }
  }
  return '';
}

export const getOverrideTransactionsRequired = (state: TrackerState, transactionId: string): boolean => {
  const transaction = getTransactionById(state, transactionId);
  return transaction?.overrideTransactionsRequired ?? false;
}

export const getOverriddenTransactionsRequired = (state: TrackerState, transactionId: string): boolean => {
  const transaction = getTransactionById(state, transactionId);
  return transaction?.overriddenTransactionRequired ?? false;
}

