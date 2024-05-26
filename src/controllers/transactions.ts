import axios from "axios";
import { apiUrlFragment, serverUrl } from "../types";
import { TrackerDispatch, TrackerVoidPromiseThunkAction } from "../models";

export const search = (startDate: string, endDate: string): TrackerVoidPromiseThunkAction => {

  return (dispatch: TrackerDispatch, getState: any) => {

    let path = serverUrl
      + apiUrlFragment
      + 'transactions';

    path += '?startDate=' + startDate;
    path += '&endDate=' + endDate;

    return axios.get(path)
      .then((transactionsResponse: any) => {
        const transactions = (transactionsResponse as any).data;
        console.log(transactions);
      });
  }
}
