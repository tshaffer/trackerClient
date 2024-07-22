import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import '../styles/Tracker.css';
import { BankTransaction, BankTransactionType, CategorizedTransaction, Category, CategoryExpensesData, CategoryMenuItem, CheckingAccountTransaction, CreditCardTransaction, StringToCategoryLUT, StringToCategoryMenuItemLUT, StringToTransactionsLUT, Transaction } from '../types';
import { formatCurrency, formatPercentage, formatDate, expensesPerMonth, roundTo } from '../utilities';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TrackerDispatch } from '../models';
import { getStartDate, getEndDate, getTransactionsByCategory, getGeneratedReportStartDate, getGeneratedReportEndDate, getCategories, getCategoryByCategoryNameLUT } from '../selectors';
import { cloneDeep, isEmpty } from 'lodash';
import { Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EditTransactionDialog from './EditTransactionDialog';
import { updateTransaction } from '../controllers';

interface SpendingReportTableProps {
  categories: Category[];
  categoryByCategoryNameLUT: StringToCategoryLUT;
  startDate: string;
  endDate: string;
  generatedReportStartDate: string;
  generatedReportEndDate: string;
  transactionsByCategoryId: StringToTransactionsLUT,
  onUpdateTransaction: (transaction: Transaction) => any;
}

const SpendingReportTable: React.FC<SpendingReportTableProps> = (props: SpendingReportTableProps) => {

  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [transactionId, setTransactionId] = React.useState('');
  const [showEditTransactionDialog, setShowEditTransactionDialog] = React.useState(false);

  const getCategoryNameFromCategoryId = (categoryId: string): string => {
    const category: Category | undefined = props.categories.find((category) => category.id === categoryId);
    return category ? category.name : '';
  }

  if (isEmpty(props.transactionsByCategoryId)) {
    return null;
  }

  const handleButtonClick = (rowId: string) => {
    setSelectedRowId(prevRowId => (prevRowId === rowId ? null : rowId));
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setTransactionId(transaction.id);
    setShowEditTransactionDialog(true);
  };

  const handleSaveTransaction = (transaction: Transaction) => {
    props.onUpdateTransaction(transaction);
  };

  const handleCloseEditTransactionDialog = () => {
    setShowEditTransactionDialog(false);
  }

  const buildCategoryMenuItems = (categories: Category[]): CategoryMenuItem[] => {
    const map: StringToCategoryMenuItemLUT = {};
    const categoryMenuItems: CategoryMenuItem[] = [];

    categories.forEach(category => {
      map[category.id] = { ...category, children: [], level: 0 };
    });

    categories.forEach(category => {
      if (category.parentId === '') {
        categoryMenuItems.push(map[category.id]);
      } else {
        map[category.parentId].children.push(map[category.id]);
      }
    });

    return categoryMenuItems;
  };

  // const getRows = (categories: CategoryMenuItem[]): CategoryExpensesData[] => {
  //   const rows: any[] = [];

  //   const processCategory = (category: CategoryMenuItem, level = 0) => {
  //     const transactions = props.transactionsByCategoryId[category.id] || [];
  //     const totalExpenses = -1 * roundTo(transactions.reduce((sum, transaction) => sum + transaction.bankTransaction.amount, 0), 2);

  //     const spaces = '\u00A0'.repeat(level * 8);

  //     const categoryRow: CategoryExpensesData = {
  //       id: category.id,
  //       categoryName: `${spaces}${category.name}`,
  //       transactions,
  //       totalExpenses,
  //       transactionCount: transactions.length,
  //       percentageOfTotal: 0,
  //     };
  //     rows.push(categoryRow);

  //     category.children.forEach((subCategory: CategoryMenuItem) => processCategory(subCategory, level + 1));
  //   };

  //   categories.forEach(category => processCategory(category));

  //   const totalAmount = rows.reduce((sum: any, row: { totalExpenses: any; }) => sum + row.totalExpenses, 0);
  //   rows.forEach((row: { percentageOfTotal: number; totalExpenses: number; }) => {
  //     row.percentageOfTotal = roundTo((row.totalExpenses / totalAmount) * 100, 2);
  //   });

  //   return rows;
  // };

  // const getRows = (categories: CategoryMenuItem[]): CategoryExpensesData[] => {

  //   const rows: CategoryExpensesData[] = [];

  //   const processCategory = (category: CategoryMenuItem, level = 0): { transactions: CategorizedTransaction[], totalExpenses: number, transactionCount: number } => {
  //     let transactions = props.transactionsByCategoryId[category.id] || [];
  //     let totalExpenses = -1 * roundTo(transactions.reduce((sum, transaction) => sum + transaction.bankTransaction.amount, 0), 2);
  //     let transactionCount = transactions.length;

  //     const spaces = '\u00A0'.repeat(level * 8);

  //     // Process children recursively
  //     category.children.forEach((subCategory: CategoryMenuItem) => {
  //       const subCategoryData = processCategory(subCategory, level + 1);
  //       transactions = transactions.concat(subCategoryData.transactions);
  //       totalExpenses += subCategoryData.totalExpenses;
  //       transactionCount += subCategoryData.transactionCount;
  //     });

  //     const categoryRow: CategoryExpensesData = {
  //       id: category.id,
  //       categoryName: `${spaces}${category.name}`,
  //       transactions,
  //       totalExpenses,
  //       transactionCount,
  //       percentageOfTotal: 0,
  //     };
  //     rows.push(categoryRow);

  //     return { transactions, totalExpenses, transactionCount };
  //   };

  //   categories.forEach(category => processCategory(category));

  //   const totalAmount = rows.reduce((sum: number, row: { totalExpenses: number }) => sum + row.totalExpenses, 0);
  //   rows.forEach((row: { percentageOfTotal: number, totalExpenses: number }) => {
  //     row.percentageOfTotal = roundTo((row.totalExpenses / totalAmount) * 100, 2);
  //   });

  //   return rows;
  // };

  // const getRows = (categories: CategoryMenuItem[]): CategoryExpensesData[] => {
  //   const rows: CategoryExpensesData[] = [];

  //   const processCategory = (category: CategoryMenuItem, level = 0): { totalExpenses: number, transactionCount: number } => {
  //     const transactions = props.transactionsByCategoryId[category.id] || [];
  //     const categoryTotalExpenses = -1 * roundTo(transactions.reduce((sum, transaction) => sum + transaction.bankTransaction.amount, 0), 2);
  //     const categoryTransactionCount = transactions.length;

  //     let totalExpenses = categoryTotalExpenses;
  //     let transactionCount = categoryTransactionCount;

  //     const spaces = '\u00A0'.repeat(level * 8);

  //     // Create the category row for the current category
  //     const categoryRow: CategoryExpensesData = {
  //       id: category.id,
  //       categoryName: `${spaces}${category.name}`,
  //       transactions,
  //       totalExpenses,
  //       transactionCount,
  //       percentageOfTotal: 0,
  //     };

  //     // Add the current category row before processing children
  //     rows.push(categoryRow);

  //     // Process children recursively
  //     category.children.forEach((subCategory: CategoryMenuItem) => {
  //       const subCategoryData = processCategory(subCategory, level + 1);
  //       totalExpenses += subCategoryData.totalExpenses;
  //       transactionCount += subCategoryData.transactionCount;
  //     });

  //     // Update the current category row with the accumulated values
  //     categoryRow.totalExpenses = totalExpenses;
  //     categoryRow.transactionCount = transactionCount;

  //     return { totalExpenses, transactionCount };
  //   };

  //   categories.forEach(category => processCategory(category));

  //   const totalAmount = rows.reduce((sum: number, row: { totalExpenses: number }) => sum + row.totalExpenses, 0);
  //   rows.forEach((row: { percentageOfTotal: number, totalExpenses: number }) => {
  //     row.percentageOfTotal = roundTo((row.totalExpenses / totalAmount) * 100, 2);
  //   });

  //   return rows;
  // };

  // const getRows = (categories: CategoryMenuItem[]): CategoryExpensesData[] => {
  //   const rows: CategoryExpensesData[] = [];

  //   const processCategory = (category: CategoryMenuItem, level = 0, parentTotalExpenses = 0): { totalExpenses: number, transactionCount: number } => {
  //     const transactions = props.transactionsByCategoryId[category.id] || [];
  //     const categoryTotalExpenses = -1 * roundTo(transactions.reduce((sum, transaction) => sum + transaction.bankTransaction.amount, 0), 2);
  //     const categoryTransactionCount = transactions.length;

  //     let totalExpenses = categoryTotalExpenses;
  //     let transactionCount = categoryTransactionCount;

  //     const spaces = '\u00A0'.repeat(level * 8);

  //     // Create the category row for the current category
  //     const categoryRow: CategoryExpensesData = {
  //       id: category.id,
  //       categoryName: `${spaces}${category.name}`,
  //       transactions,
  //       totalExpenses,
  //       transactionCount,
  //       percentageOfTotal: parentTotalExpenses ? roundTo((categoryTotalExpenses / parentTotalExpenses) * 100, 2) : 0,
  //     };

  //     // Add the current category row before processing children
  //     rows.push(categoryRow);

  //     // Process children recursively
  //     category.children.forEach((subCategory: CategoryMenuItem) => {
  //       const subCategoryData = processCategory(subCategory, level + 1, totalExpenses);
  //       totalExpenses += subCategoryData.totalExpenses;
  //       transactionCount += subCategoryData.transactionCount;
  //     });

  //     // Update the current category row with the accumulated values
  //     categoryRow.totalExpenses = totalExpenses;
  //     categoryRow.transactionCount = transactionCount;

  //     return { totalExpenses, transactionCount };
  //   };

  //   categories.forEach(category => processCategory(category));

  //   const totalAmount = rows.reduce((sum: number, row: { totalExpenses: number }) => sum + row.totalExpenses, 0);
  //   rows.forEach((row: { percentageOfTotal: number, totalExpenses: number }) => {
  //     if (row.percentageOfTotal === 0 && totalAmount !== 0) {
  //       row.percentageOfTotal = roundTo((row.totalExpenses / totalAmount) * 100, 2);
  //     }
  //   });

  //   return rows;
  // };

  // const getRows = (categories: CategoryMenuItem[]): CategoryExpensesData[] => {
  //   const rows: CategoryExpensesData[] = [];
  //   const categoryExpensesMap = new Map<string, number>();
  
  //   // First pass to accumulate the total expenses for each category
  //   const accumulateExpenses = (category: CategoryMenuItem): number => {
  //     const transactions = props.transactionsByCategoryId[category.id] || [];
  //     const categoryTotalExpenses = -1 * roundTo(transactions.reduce((sum, transaction) => sum + transaction.bankTransaction.amount, 0), 2);
  //     let totalExpenses = categoryTotalExpenses;
  
  //     category.children.forEach((subCategory) => {
  //       totalExpenses += accumulateExpenses(subCategory);
  //     });
  
  //     categoryExpensesMap.set(category.id, totalExpenses);
  //     return totalExpenses;
  //   };
  
  //   categories.forEach(category => accumulateExpenses(category));
  
  //   // Second pass to build rows and calculate percentages
  //   const processCategory = (category: CategoryMenuItem, level = 0, parentTotalExpenses = 0) => {
  //     const transactions = props.transactionsByCategoryId[category.id] || [];
  //     const categoryTotalExpenses = categoryExpensesMap.get(category.id) || 0;
  //     const categoryTransactionCount = transactions.length;
  
  //     const spaces = '\u00A0'.repeat(level * 8);
  
  //     const percentageOfParent = parentTotalExpenses ? roundTo((categoryTotalExpenses / parentTotalExpenses) * 100, 2) : 0;
  
  //     const categoryRow: CategoryExpensesData = {
  //       id: category.id,
  //       categoryName: `${spaces}${category.name}`,
  //       transactions,
  //       totalExpenses: categoryTotalExpenses,
  //       transactionCount: categoryTransactionCount,
  //       percentageOfTotal: percentageOfParent,
  //     };
  
  //     rows.push(categoryRow);
  
  //     category.children.forEach((subCategory) => {
  //       processCategory(subCategory, level + 1, categoryTotalExpenses);
  //     });
  //   };
  
  //   categories.forEach(category => processCategory(category));
  
  //   return rows;
  // };

  // const getRows = (categories: CategoryMenuItem[]): CategoryExpensesData[] => {
  //   const rows: CategoryExpensesData[] = [];
  //   const categoryExpensesMap = new Map<string, number>();
  //   let totalTopLevelExpenses = 0;
  
  //   // First pass to accumulate the total expenses for each category
  //   const accumulateExpenses = (category: CategoryMenuItem): number => {
  //     const transactions = props.transactionsByCategoryId[category.id] || [];
  //     const categoryTotalExpenses = -1 * roundTo(transactions.reduce((sum, transaction) => sum + transaction.bankTransaction.amount, 0), 2);
  //     let totalExpenses = categoryTotalExpenses;
  
  //     category.children.forEach((subCategory) => {
  //       totalExpenses += accumulateExpenses(subCategory);
  //     });
  
  //     categoryExpensesMap.set(category.id, totalExpenses);
  
  //     // Accumulate total expenses for top-level categories
  //     if (category.parentId === '') {
  //       totalTopLevelExpenses += totalExpenses;
  //     }
  
  //     return totalExpenses;
  //   };
  
  //   categories.forEach(category => accumulateExpenses(category));
  
  //   // Second pass to build rows and calculate percentages
  //   const processCategory = (category: CategoryMenuItem, level = 0, parentTotalExpenses = 0) => {
  //     const transactions = props.transactionsByCategoryId[category.id] || [];
  //     const categoryTotalExpenses = categoryExpensesMap.get(category.id) || 0;
  //     const categoryTransactionCount = transactions.length;
  
  //     const spaces = '\u00A0'.repeat(level * 8);
  
  //     const percentageOfParent = parentTotalExpenses ? roundTo((categoryTotalExpenses / parentTotalExpenses) * 100, 2) : 0;
  //     const percentageOfTotal = parentTotalExpenses === 0 && totalTopLevelExpenses !== 0 
  //       ? roundTo((categoryTotalExpenses / totalTopLevelExpenses) * 100, 2) 
  //       : percentageOfParent;
  
  //     const categoryRow: CategoryExpensesData = {
  //       id: category.id,
  //       categoryName: `${spaces}${category.name}`,
  //       transactions,
  //       totalExpenses: categoryTotalExpenses,
  //       transactionCount: categoryTransactionCount,
  //       percentageOfTotal: percentageOfTotal,
  //     };
  
  //     rows.push(categoryRow);
  
  //     category.children.forEach((subCategory) => {
  //       processCategory(subCategory, level + 1, categoryTotalExpenses);
  //     });
  //   };
  
  //   categories.forEach(category => processCategory(category));
  
  //   return rows;
  // };
  
  const sortCategoriesRecursively = (categories: CategoryExpensesData[]): CategoryExpensesData[] => {
    const sortedCategories = [...categories].sort((a, b) => b.totalExpenses - a.totalExpenses);
  
    sortedCategories.forEach((category) => {
      if (category.children && category.children.length > 0) {
        category.children = sortCategoriesRecursively(category.children);
      }
    });
  
    return sortedCategories;
  };
  
  const getRows = (categories: CategoryMenuItem[]): CategoryExpensesData[] => {
    const rows: CategoryExpensesData[] = [];
    const categoryExpensesMap = new Map<string, number>();
    let totalTopLevelExpenses = 0;
  
    // First pass to accumulate the total expenses for each category
    const accumulateExpenses = (category: CategoryMenuItem): number => {
      const transactions = props.transactionsByCategoryId[category.id] || [];
      const categoryTotalExpenses = -1 * roundTo(transactions.reduce((sum, transaction) => sum + transaction.bankTransaction.amount, 0), 2);
      let totalExpenses = categoryTotalExpenses;
  
      category.children.forEach((subCategory) => {
        totalExpenses += accumulateExpenses(subCategory);
      });
  
      categoryExpensesMap.set(category.id, totalExpenses);
  
      // Accumulate total expenses for top-level categories
      if (category.parentId === '') {
        totalTopLevelExpenses += totalExpenses;
      }
  
      return totalExpenses;
    };
  
    categories.forEach(category => accumulateExpenses(category));
  
    // Second pass to build rows and calculate percentages
    const processCategory = (category: CategoryMenuItem, level = 0, parentTotalExpenses = 0) => {
      const transactions = props.transactionsByCategoryId[category.id] || [];
      const categoryTotalExpenses = categoryExpensesMap.get(category.id) || 0;
      const categoryTransactionCount = transactions.length;
  
      const spaces = '\u00A0'.repeat(level * 8);
  
      const percentageOfParent = parentTotalExpenses ? roundTo((categoryTotalExpenses / parentTotalExpenses) * 100, 2) : 0;
      const percentageOfTotal = parentTotalExpenses === 0 && totalTopLevelExpenses !== 0 
        ? roundTo((categoryTotalExpenses / totalTopLevelExpenses) * 100, 2) 
        : percentageOfParent;
  
      const categoryRow: CategoryExpensesData = {
        id: category.id,
        categoryName: `${spaces}${category.name}`,
        transactions,
        totalExpenses: categoryTotalExpenses,
        transactionCount: categoryTransactionCount,
        percentageOfTotal: percentageOfTotal,
        children: []
      };
  
      rows.push(categoryRow);
  
      category.children.forEach((subCategory) => {
        const subCategoryRow = processCategory(subCategory, level + 1, categoryTotalExpenses);
        categoryRow.children.push(subCategoryRow);
      });
  
      return categoryRow;
    };
  
    categories.forEach(category => processCategory(category));
  
    const sortedRows = sortCategoriesRecursively(rows);
  
    // Flatten the sorted structure for rendering
    const flattenRows = (sortedRows: CategoryExpensesData[], flatRows: CategoryExpensesData[] = []): CategoryExpensesData[] => {
      sortedRows.forEach((row) => {
        flatRows.push(row);
        if (row.children && row.children.length > 0) {
          flattenRows(row.children, flatRows);
        }
      });
      return flatRows;
    };
  
    return flattenRows(sortedRows);
  };  
  
  const categoryMenuItems: CategoryMenuItem[] = buildCategoryMenuItems(props.categories);

  const rows: CategoryExpensesData[] = getRows(categoryMenuItems);

  let totalAmount = 0;
  for (const categoryExpensesData of rows) {
    const category: Category = props.categoryByCategoryNameLUT[categoryExpensesData.categoryName.trim()];
    if (category.parentId === '') {
      totalAmount += categoryExpensesData.totalExpenses;
    }
  }

  // const sortedRows = rows.sort((a: { totalExpenses: number; }, b: { totalExpenses: number; }) => b.totalExpenses - a.totalExpenses);
  // const sortedRows = cloneDeep(rows);
  const sortedRows = rows.sort((a, b) => b.totalExpenses - a.totalExpenses);

  return (
    <React.Fragment>
      <EditTransactionDialog
        open={showEditTransactionDialog}
        transactionId={transactionId}
        onClose={handleCloseEditTransactionDialog}
        onSave={handleSaveTransaction}
      />
      <h4>Date Range {formatDate(props.generatedReportStartDate)} - {formatDate(props.generatedReportEndDate)}</h4>
      <h4>Total Amount: {formatCurrency(totalAmount)}</h4>
      <h4>Per Month: {expensesPerMonth(totalAmount, props.generatedReportStartDate, props.generatedReportEndDate)}</h4>
      <div className="table-container">
        <div className="table-header">
          <div className="table-row">
            <div className="table-cell"></div>
            <div className="table-cell">Category</div>
            <div className="table-cell">Transaction Count</div>
            <div className="table-cell">Total Amount</div>
            <div className="table-cell">Percentage of Total</div>
          </div>
        </div>
        <div className="spending-report-table-body">
          {sortedRows.map((categoryExpenses: { id: React.Key | null | undefined; categoryName: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; transactionCount: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; totalExpenses: number; percentageOfTotal: number; transactions: any[]; }) => (
            <React.Fragment key={categoryExpenses.id}>
              <div className="table-row">
                <div className="table-cell">
                  <IconButton onClick={() => handleButtonClick(categoryExpenses.id as string)}>
                    {selectedRowId === categoryExpenses.id ? <RemoveIcon /> : <AddIcon />}
                  </IconButton>
                </div>
                <div className="table-cell">{categoryExpenses.categoryName}</div>
                <div className="table-cell">{categoryExpenses.transactionCount}</div>
                <div className="table-cell">{formatCurrency(categoryExpenses.totalExpenses)}</div>
                <div className="table-cell">{formatPercentage(categoryExpenses.percentageOfTotal)}</div>
              </div>
              {selectedRowId === categoryExpenses.id && (
                <div className="details-table-container">
                  <div className="table-header">
                    <div className="table-row">
                      <div className="table-cell"></div>
                      <div className="table-cell">Date</div>
                      <div className="table-cell">Amount</div>
                      <div className="table-cell">Description</div>
                    </div>
                  </div>
                  <div className="table-body">
                    {categoryExpenses.transactions.map((transaction: { bankTransaction: Transaction; }) => (
                      <div className="table-row" key={transaction.bankTransaction.id}>
                        <div className="table-cell">
                          <Tooltip title="Edit transaction">
                            <IconButton onClick={() => handleEditTransaction(transaction.bankTransaction)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </div>
                        <div className="table-cell">{formatDate(transaction.bankTransaction.transactionDate)}</div>
                        <div className="table-cell">{formatCurrency(-transaction.bankTransaction.amount)}</div>
                        <div className="table-cell">{transaction.bankTransaction.userDescription}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </React.Fragment >
  );
};


function mapStateToProps(state: any) {
  return {
    categories: getCategories(state),
    categoryByCategoryNameLUT: getCategoryByCategoryNameLUT(state),
    startDate: getStartDate(state),
    endDate: getEndDate(state),
    generatedReportStartDate: getGeneratedReportStartDate(state),
    generatedReportEndDate: getGeneratedReportEndDate(state),
    transactionsByCategoryId: getTransactionsByCategory(state),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
    onUpdateTransaction: updateTransaction,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SpendingReportTable);
