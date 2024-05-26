import axios from "axios";
import { TrackerVoidPromiseThunkAction, TrackerDispatch } from "../models";
import { apiUrlFragment, serverUrl } from "../types";

export const uploadFile = (formData: FormData): TrackerVoidPromiseThunkAction => {
  return (dispatch: TrackerDispatch, getState: any) => {
    const path = serverUrl + apiUrlFragment + 'creditCardStatement';
    return axios.post(path, formData);
  };
};