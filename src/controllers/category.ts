import axios from "axios";
import { CategoryEntity, serverUrl, apiUrlFragment, CategoryKeywordEntity } from "../types";
import { TrackerAnyPromiseThunkAction, TrackerDispatch, addCategories, addCategoryKeywordRedux, addCategoryKeywords, addCategoryRedux, deleteCategoryKeywordRedux, updateCategoryKeywordRedux } from '../models';

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

export const loadCategoryKeywords = (): TrackerAnyPromiseThunkAction => {

  return (dispatch: TrackerDispatch, getState: any) => {

    const path = serverUrl + apiUrlFragment + 'categoryKeywords';

    return axios.get(path)
      .then((response: any) => {
        const categoryKeywordEntities: CategoryKeywordEntity[] = response.data;
        dispatch(addCategoryKeywords(categoryKeywordEntities));
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

export const updateCategoryKeywordServerAndRedux = (categoryKeywordEntity: CategoryKeywordEntity): TrackerAnyPromiseThunkAction => {

  return (dispatch: TrackerDispatch, getState: any) => {

    const path = serverUrl + apiUrlFragment + 'updateCategoryKeyword';

    const updateCategoryKeywordBody = categoryKeywordEntity;

    return axios.post(
      path,
      updateCategoryKeywordBody
    ).then((response) => {
      dispatch(updateCategoryKeywordRedux(categoryKeywordEntity));
      return Promise.resolve();
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return '';
    });
  };
};

export const deleteCategoryKeywordServerAndRedux = (categoryKeywordEntity: CategoryKeywordEntity): TrackerAnyPromiseThunkAction => {

  return (dispatch: TrackerDispatch, getState: any) => {

    const path = serverUrl + apiUrlFragment + 'deleteCategoryKeyword';

    const deleteCategoryKeywordBody = categoryKeywordEntity;

    return axios.post(
      path,
      deleteCategoryKeywordBody
    ).then((response) => {
      dispatch(deleteCategoryKeywordRedux(categoryKeywordEntity));
      return Promise.resolve();
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return '';
    });
  };
};
