import axios from "axios";
import { CategoryEntity, serverUrl, apiUrlFragment } from "../types";
import { TrackerAnyPromiseThunkAction, TrackerDispatch, addCategoryRedux } from '../models';

export const addCategoryServerAndRedux = (categoryEntity: CategoryEntity): TrackerAnyPromiseThunkAction => {

  return (dispatch: TrackerDispatch, getState: any) => {

    const path = serverUrl + apiUrlFragment + 'addCategory';

    const addCategoryBody = categoryEntity;

    return axios.post(
      path,
      addCategoryBody
    ).then((response) => {
      dispatch(addCategoryRedux(categoryEntity));
      return Promise.resolve();
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return '';
    });
  };
};

