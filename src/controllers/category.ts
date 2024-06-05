import axios from "axios";
import { CategoryEntity, serverUrl, apiUrlFragment, CategoryKeywordEntity } from "../types";
import { TrackerAnyPromiseThunkAction, TrackerDispatch, addCategories, addCategoryKeywordRedux, addCategoryRedux } from '../models';

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

export const addCategoryKeywordServerAndRedux = (categoryKeywordEntity: CategoryKeywordEntity): TrackerAnyPromiseThunkAction => {
  
    return (dispatch: TrackerDispatch, getState: any) => {
  
      const path = serverUrl + apiUrlFragment + 'addCategoryKeyword';
  
      const addCategoryKeywordBody = categoryKeywordEntity;
  
      return axios.post(
        path,
        addCategoryKeywordBody
      ).then((response) => {
        dispatch(addCategoryKeywordRedux(categoryKeywordEntity));
        return Promise.resolve();
      }).catch((error) => {
        console.log('error');
        console.log(error);
        return '';
      });
    };
  }
