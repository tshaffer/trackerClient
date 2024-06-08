import axios from "axios";
import {
  apiUrlFragment,
  BankTransactionEntity,
  BankTransactionType,
  CategorizedStatementData,
  CategorizedTransactionEntity,
  serverUrl,
  StringToTransactionsLUT,
} from "../types";
import {
  setStatementData,
  setTransactionsByCategory,
  setUnidentifiedBankTransactions,
  TrackerDispatch,
  TrackerVoidPromiseThunkAction
} from "../models";

export const search = (startDate: string, endDate: string): TrackerVoidPromiseThunkAction => {

  return (dispatch: TrackerDispatch, getState: any) => {

    let path = serverUrl
      + apiUrlFragment
      + 'categorizedTransactions';

    path += '?startDate=' + startDate;
    path += '&endDate=' + endDate;

    return axios.get(path)
      .then((transactionsResponse: any) => {
        const categorizedStatementData: CategorizedStatementData = (transactionsResponse as any).data;
        const transactions: CategorizedTransactionEntity[] = categorizedStatementData.transactions;
        const unidentifiedBankTransactions: BankTransactionEntity[] = categorizedStatementData.unidentifiedBankTransactions;
        const transactionsByCategory: StringToTransactionsLUT = {};
        transactions.forEach((transaction: CategorizedTransactionEntity) => {
          const category: string = transaction.categoryEntity.keyword;
          if (!transactionsByCategory[category]) {
            transactionsByCategory[category] = [];
          }
          transactionsByCategory[category].push(transaction);
        });

        const { startDate, endDate, total } = categorizedStatementData;
        dispatch(setStatementData(startDate, endDate, total));

        console.log(transactionsByCategory);
        dispatch(setTransactionsByCategory(transactionsByCategory));

        dispatch(setUnidentifiedBankTransactions(unidentifiedBankTransactions));
      });
  }
}
