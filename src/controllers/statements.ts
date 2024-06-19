import axios from "axios";
import { TrackerVoidPromiseThunkAction, TrackerDispatch, TrackerAnyPromiseThunkAction, addCheckingAccountStatements, addCreditCardStatements } from "../models";
import { CheckingAccountStatementEntity, CreditCardStatementEntity, apiUrlFragment, serverUrl } from "../types";

export const loadCreditCardStatements = (): TrackerAnyPromiseThunkAction => {

  return (dispatch: TrackerDispatch, getState: any) => {

    const path = serverUrl + apiUrlFragment + 'creditCardStatements';

    return axios.get(path)
      .then((response: any) => {
        const statements: CreditCardStatementEntity[] = response.data;
        dispatch(addCreditCardStatements(statements));
        return Promise.resolve();
      }).catch((error) => {
        console.log('error');
        console.log(error);
        return '';
      });
  };
};


export const loadCheckingAccountStatements = (): TrackerAnyPromiseThunkAction => {

  return (dispatch: TrackerDispatch, getState: any) => {

    const path = serverUrl + apiUrlFragment + 'checkingAccountStatements';

    return axios.get(path)
      .then((response: any) => {
        const statements: CheckingAccountStatementEntity[] = response.data;
        dispatch(addCheckingAccountStatements(statements));
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