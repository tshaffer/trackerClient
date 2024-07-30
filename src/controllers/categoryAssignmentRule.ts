import axios from "axios";
import { serverUrl, apiUrlFragment, CategoryAssignmentRule } from "../types";
import { TrackerAnyPromiseThunkAction, TrackerDispatch, addCategoryAssignmentRuleRedux, addCategoryAssignmentRules, deleteCategoryAssignmentRuleRedux, updateCategoryAssignmentRuleRedux } from '../models';

export const loadCategoryAssignmentRules = (): TrackerAnyPromiseThunkAction => {

  return (dispatch: TrackerDispatch, getState: any) => {

    const path = serverUrl + apiUrlFragment + 'categoryAssignmentRules';

    return axios.get(path)
      .then((response: any) => {
        const categoryAssignmentRules: CategoryAssignmentRule[] = response.data;
        dispatch(addCategoryAssignmentRules(categoryAssignmentRules));
        return Promise.resolve();
      }).catch((error) => {
        console.log('error');
        console.log(error);
        return '';
      });
  };
};

export const addCategoryAssignmentRuleServerAndRedux = (categoryAssignmentRule: CategoryAssignmentRule): TrackerAnyPromiseThunkAction => {

  return (dispatch: TrackerDispatch, getState: any) => {

    const path = serverUrl + apiUrlFragment + 'addCategoryAssignmentRule';

    const addCategoryAssignmentRuleBody = categoryAssignmentRule;

    return axios.post(
      path,
      addCategoryAssignmentRuleBody
    ).then((response) => {
      dispatch(addCategoryAssignmentRuleRedux(categoryAssignmentRule));
      return Promise.resolve();
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return '';
    });
  };
}

export const updateCategoryAssignmentRuleServerAndRedux = (categoryAssignmentRule: CategoryAssignmentRule): TrackerAnyPromiseThunkAction => {

  return (dispatch: TrackerDispatch, getState: any) => {

    const path = serverUrl + apiUrlFragment + 'updateCategoryAssignmentRule';

    const updateCategoryAssignmentRuleBody = categoryAssignmentRule;

    return axios.post(
      path,
      updateCategoryAssignmentRuleBody
    ).then((response) => {
      dispatch(updateCategoryAssignmentRuleRedux(categoryAssignmentRule));
      return Promise.resolve();
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return '';
    });
  };
};

export const deleteCategoryAssignmentRuleServerAndRedux = (categoryAssignmentRule: CategoryAssignmentRule): TrackerAnyPromiseThunkAction => {

  return (dispatch: TrackerDispatch, getState: any) => {

    const path = serverUrl + apiUrlFragment + 'deleteCategoryAssignmentRule';

    const deleteCategoryAssignmentRuleBody = categoryAssignmentRule;

    return axios.post(
      path,
      deleteCategoryAssignmentRuleBody
    ).then((response) => {
      dispatch(deleteCategoryAssignmentRuleRedux(categoryAssignmentRule));
      return Promise.resolve();
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return '';
    });
  };
};
