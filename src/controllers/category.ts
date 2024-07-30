import axios from "axios";
import { Category, serverUrl, apiUrlFragment } from "../types";
import { TrackerAnyPromiseThunkAction, TrackerDispatch, addCategories, addCategoryRedux } from '../models';

export const loadCategories = (): TrackerAnyPromiseThunkAction => {

  return (dispatch: TrackerDispatch, getState: any) => {

    const path = serverUrl + apiUrlFragment + 'categories';

    return axios.get(path)
      .then((response: any) => {
        const categories: Category[] = response.data;
        dispatch(addCategories(categories));
        return Promise.resolve();
      }).catch((error) => {
        console.log('error');
        console.log(error);
        return '';
      });
  };
};

export const addCategoryServerAndRedux = (category: Category): TrackerAnyPromiseThunkAction => {

  return (dispatch: TrackerDispatch, getState: any) => {

    const path = serverUrl + apiUrlFragment + 'addCategory';

    const addCategoryBody = category;

    return axios.post(
      path,
      addCategoryBody
    ).then((response) => {
      console.log('addCategoryServerAndRedux');
      console.log(response);
      console.log(response.data);
      dispatch(addCategoryRedux(category));
      return Promise.resolve(response.data as Category);
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return '';
    });
  };
};

