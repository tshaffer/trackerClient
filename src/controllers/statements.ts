import axios from "axios";
import { TrackerVoidPromiseThunkAction, TrackerDispatch, addStatements, TrackerAnyPromiseThunkAction } from "../models";
import { StatementEntity, apiUrlFragment, serverUrl } from "../types";

export const loadStatements = (): TrackerAnyPromiseThunkAction => {

  return (dispatch: TrackerDispatch, getState: any) => {

    const path = serverUrl + apiUrlFragment + 'statements';

    return axios.get(path)
      .then((response: any) => {
        const statements: StatementEntity[] = response.data;
        dispatch(addStatements(statements));
        return Promise.resolve();
      }).catch((error) => {
        console.log('error');
        console.log(error);
        return '';
      });
  };
};


export const uploadFile = (formData: FormData): TrackerVoidPromiseThunkAction => {
  return (dispatch: TrackerDispatch, getState: any) => {
    const path = serverUrl + apiUrlFragment + 'creditCardStatement';
    return axios.post(path, formData);
  };
};