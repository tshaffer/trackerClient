import { isNil } from 'lodash';
import { BankTransaction, BankTransactionType, CategorizedStatementData, CategorizedTransaction, Category, CategoryAssignmentRule, CheckingAccountTransaction, CreditCardTransaction, DisregardLevel, ReviewedTransactions, StringToTransactionsLUT, TrackerState, Transaction } from '../types';
import { getCategories, getCategoryAssignmentRules, getCategoryByName } from './categoryState';
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

// export const getTransactionsByCategory = (state: TrackerState, categoryId: string): Transaction[] => {
//   return getTransactions(state).filter((transaction) => transaction.categoryId === categoryId);
// };


export const getTransactionsByCategory = (state: TrackerState): StringToTransactionsLUT => {

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

  const transactions: CategorizedTransaction[] = [];
  let sum = 0;

  for (const categorizedTransaction of categorizedTransactions) {
    const transaction: CategorizedTransaction = {
      bankTransaction: categorizedTransaction.bankTransaction,
      category: categorizedTransaction.category,
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
  };

  const transactionsByCategory: StringToTransactionsLUT = {};
  transactions.forEach((transaction: CategorizedTransaction) => {
    const category: string = transaction.category.name;
    if (!transactionsByCategory[category]) {
      transactionsByCategory[category] = [];
    }
    transactionsByCategory[category].push(transaction);

    // const { startDate, endDate, netDebits: netDebits } = categorizedStatementData;
    // dispatch(setStatementData(startDate, endDate, netDebits));

    // console.log(transactionsByCategory);
    // dispatch(setTransactionsByCategory(transactionsByCategory));

    // dispatch(setUnidentifiedBankTransactions(unidentifiedBankTransactions));
    });

  return transactionsByCategory;
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

  let sum: number = 0;

  for (const transaction of transactions) {
    const category: Category | null = categorizeTransaction(transaction, categories, categoryAssignmentRules);
    if (!isNil(category)) {
      if (category.id === ignoreCategory.id) {
        ignoredTransactions.push(transaction);
      } else {
        const categorizedTransaction: CategorizedTransaction = {
          bankTransaction: transaction,
          category: category,
        };
        categorizedTransactions.push(categorizedTransaction);

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
  };
};

const categorizeTransaction = (
  transaction: BankTransaction,
  categories: Category[],
  categoryAssignmentRules: CategoryAssignmentRule[]): Category | null => {

  const transactionDetails: string = transaction.bankTransactionType === BankTransactionType.CreditCard ?
    (transaction as CreditCardTransaction).description : (transaction as CheckingAccountTransaction).name;

  for (const categoryAssignmentRule of categoryAssignmentRules) {
    if (transactionDetails.includes(categoryAssignmentRule.pattern)) {
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

