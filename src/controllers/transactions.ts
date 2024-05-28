import axios from "axios";
import { apiUrlFragment, serverUrl, StringToTransactionsLUT, TransactionsDataResponseItem } from "../types";
import { TrackerDispatch, TrackerVoidPromiseThunkAction } from "../models";

export const search = (startDate: string, endDate: string): TrackerVoidPromiseThunkAction => {

  return (dispatch: TrackerDispatch, getState: any) => {

    let path = serverUrl
      + apiUrlFragment
      + 'categorizedTransactions';

    path += '?startDate=' + startDate;
    path += '&endDate=' + endDate;

    return axios.get(path)
      .then((transactionsResponse: any) => {
        const transactions: TransactionsDataResponseItem[] = (transactionsResponse as any).data;
        const transactionsByCategory: StringToTransactionsLUT = {};
        transactions.forEach((transactionData: TransactionsDataResponseItem) => {
          const category = transactionData.category.keyword;
          if (!transactionsByCategory[category]) {
            transactionsByCategory[category] = [];
          }
          transactionsByCategory[category].push(transactionData.transaction);
        });
        console.log(transactionsByCategory);
      });
  }
}
