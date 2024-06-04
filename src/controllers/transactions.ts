import axios from "axios";
import {
  apiUrlFragment,
  CategorizedStatementData,
  serverUrl,
  StringToTransactionsLUT,
  TransactionEntity
} from "../types";
import {
  setStatementData,
  setTransactionsByCategory,
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
        const transactions: TransactionEntity[] = categorizedStatementData.transactions;
        const transactionsByCategory: StringToTransactionsLUT = {};
        transactions.forEach((transaction: TransactionEntity) => {
          const category = transaction.category;
          if (!transactionsByCategory[category]) {
            transactionsByCategory[category] = [];
          }
          transactionsByCategory[category].push(transaction);
        });

        const { startDate, endDate, total } = categorizedStatementData;
        dispatch(setStatementData(startDate, endDate, total));

        console.log(transactionsByCategory);
        dispatch(setTransactionsByCategory(transactionsByCategory));
      });
  }
}
