import axios from "axios";
import { serverUrl, apiUrlFragment } from "../types";
import { TrackerAnyPromiseThunkAction, TrackerDispatch } from "../models";

export const initializeServer = (): TrackerAnyPromiseThunkAction => {
  return (dispatch: TrackerDispatch, getState: any) => {
    const path = serverUrl + apiUrlFragment + 'initializeDB';
    return axios.post(path);
  };
};

