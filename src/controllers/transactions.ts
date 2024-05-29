import axios from "axios";
import { apiUrlFragment, CategorizedStatementData, serverUrl, StringToTransactionsLUT, TransactionsDataResponseItem } from "../types";
import { setStatementData, setTransactionsByCategory, TrackerDispatch, TrackerVoidPromiseThunkAction } from "../models";

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
        const transactions: TransactionsDataResponseItem[] = categorizedStatementData.transactions;
        const transactionsByCategory: StringToTransactionsLUT = {};
        transactions.forEach((transactionData: TransactionsDataResponseItem) => {
          const category = transactionData.category.keyword;
          if (!transactionsByCategory[category]) {
            transactionsByCategory[category] = [];
          }
          transactionsByCategory[category].push(transactionData.transaction);
        });

        const { startDate, endDate, total } = categorizedStatementData;
        dispatch(setStatementData(startDate, endDate, total));
        
        console.log(transactionsByCategory);
        dispatch(setTransactionsByCategory(transactionsByCategory));
      });
  }
}
