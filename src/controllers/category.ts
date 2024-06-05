import axios from "axios";
import { CategoryEntity, serverUrl, apiUrlFragment } from "../types";
import { TrackerAnyPromiseThunkAction, TrackerDispatch, addCategories, addCategoryRedux } from '../models';

export const loadCategories = (): TrackerAnyPromiseThunkAction => {

  return (dispatch: TrackerDispatch, getState: any) => {

    const path = serverUrl + apiUrlFragment + 'categories';

    return axios.get(path)
      .then((response: any) => {
        const categories: CategoryEntity[] = response.data;
        dispatch(addCategories(categories));
        return Promise.resolve();
      }).catch((error) => {
        console.log('error');
        console.log(error);
        return '';
      });
  };
};


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

