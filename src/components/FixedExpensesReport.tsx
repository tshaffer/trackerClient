import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import '../styles/Tracker.css';
import { TrackerDispatch } from '../models';
import { formatDate, formatCurrency, expensesPerMonth, roundTo, formatPercentage } from '../utilities';
import { getCategories, getCategoryByCategoryNameLUT, getCategoryByName, getFixedExpensesByCategory, getGeneratedReportEndDate, getGeneratedReportStartDate } from '../selectors';
import { Category, CategoryExpensesData, CategoryMenuItem, StringToCategoryLUT, StringToCategoryMenuItemLUT, StringToTransactionsLUT, Transaction } from '../types';
import { cloneDeep, isEmpty, isNil } from 'lodash';

interface FixedExpensesReportProps {
  categories: Category[];
  categoryByCategoryNameLUT: StringToCategoryLUT;
  generatedReportStartDate: string;
  generatedReportEndDate: string;
  fixedExpensesByCategoryId: StringToTransactionsLUT;
  ignoreCategory: Category | undefined;
}

const FixedExpensesReport: React.FC<FixedExpensesReportProps> = (props: FixedExpensesReportProps) => {

  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  if (isEmpty(props.fixedExpensesByCategoryId)) {
    return null;
  }

  const handleButtonClick = (rowId: string) => {
    setSelectedRowId(prevRowId => (prevRowId === rowId ? null : rowId));
  };

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

  const sortCategoriesRecursively = (categories: CategoryExpensesData[]): CategoryExpensesData[] => {

    // Sort top-level categories by total expenses
    const sortedCategories = [...categories].sort((a, b) => b.totalExpenses - a.totalExpenses);

    // Recursively sort children
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
      const transactions = props.fixedExpensesByCategoryId[category.id] || [];
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
    const processCategory = (category: CategoryMenuItem, level = 0, parentTotalExpenses = 0): CategoryExpensesData => {
      const transactions = props.fixedExpensesByCategoryId[category.id] || [];
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

      category.children.forEach((subCategory) => {
        const subCategoryRow = processCategory(subCategory, level + 1, categoryTotalExpenses);
        categoryRow.children.push(subCategoryRow);
      });

      return categoryRow;
    };

    // Collect top-level rows
    categories.forEach(category => {
      if (category.parentId === '') {
        rows.push(processCategory(category));
      }
    });

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

  let trimmedCategories = cloneDeep(props.categories);
  if (!isNil(props.ignoreCategory)) {
    trimmedCategories = props.categories.filter(category => category.id !== props.ignoreCategory!.id)
  }

  const categoryMenuItems: CategoryMenuItem[] = buildCategoryMenuItems(trimmedCategories);

  const rows: CategoryExpensesData[] = getRows(categoryMenuItems);
  let totalAmount = 0;
  for (const categoryExpensesData of rows) {
    const category: Category = props.categoryByCategoryNameLUT[categoryExpensesData.categoryName.trim()];
    if (category.parentId === '') {
      totalAmount += categoryExpensesData.totalExpenses;
    }
  }

  return (
    <React.Fragment>
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
          {rows.map((categoryExpenses: { id: React.Key | null | undefined; categoryName: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; transactionCount: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; totalExpenses: number; percentageOfTotal: number; transactions: any[]; }) => (
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
                    {categoryExpenses.transactions.map((transaction: { bankTransaction: Transaction }) => (
                      <div className="table-row" key={transaction.bankTransaction.id}>
                        <div className="table-cell"></div>
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
    </React.Fragment>
  );
}

function mapStateToProps(state: any) {
  return {
    categories: getCategories(state),
    categoryByCategoryNameLUT: getCategoryByCategoryNameLUT(state),
    generatedReportStartDate: getGeneratedReportStartDate(state),
    generatedReportEndDate: getGeneratedReportEndDate(state),
    fixedExpensesByCategoryId: getFixedExpensesByCategory(state),
    ignoreCategory: getCategoryByName(state, 'Ignore'),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(FixedExpensesReport);

