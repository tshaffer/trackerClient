import { cloneDeep } from 'lodash';
import { CategoryAssignmentRule, CategoryAssignmentRulesState, CategoryState } from '../types';
import { TrackerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_CATEGORY_ASSIGNMENT_RULE = 'ADD_CATEGORY_ASSIGNMENT_RULE';
export const ADD_CATEGORY_ASSIGNMENT_RULES = 'ADD_CATEGORY_ASSIGNMENT_RULES';
export const UPDATE_CATEGORY_ASSIGNMENT_RULE = 'UPDATE_CATEGORY_ASSIGNMENT_RULE';
export const DELETE_CATEGORY_ASSIGNMENT_RULE = 'DELETE_CATEGORY_ASSIGNMENT_RULE';

// ------------------------------------
// Actions
// ------------------------------------

interface AddCategoryAssignmentRulePayload {
  categoryAssignmentRule: CategoryAssignmentRule,
}

export const addCategoryAssignmentRuleRedux = (categoryAssignmentRule: CategoryAssignmentRule): any => {
  return {
    type: ADD_CATEGORY_ASSIGNMENT_RULE,
    payload: {
      categoryAssignmentRule
    }
  };
}

export const updateCategoryAssignmentRuleRedux = (categoryAssignmentRule: CategoryAssignmentRule): any => {
  return {
    type: UPDATE_CATEGORY_ASSIGNMENT_RULE,
    payload: {
      categoryAssignmentRule
    }
  };
}

export const deleteCategoryAssignmentRuleRedux = (categoryAssignmentRule: CategoryAssignmentRule): any => {
  return {
    type: DELETE_CATEGORY_ASSIGNMENT_RULE,
    payload: {
      categoryAssignmentRule
    }
  };
}

interface AddCategoryAssignmentRulesPayload {
  categoryAssignmentRules: CategoryAssignmentRule[];
}

export const addCategoryAssignmentRules = (
  categoryAssignmentRules: CategoryAssignmentRule[],
): any => {
  return {
    type: ADD_CATEGORY_ASSIGNMENT_RULES,
    payload: {
      categoryAssignmentRules
    }
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: CategoryAssignmentRulesState = {
  categoryAssignmentRules: [],
};

export const categoryAssignmentRulesStateReducer = (
  state: CategoryAssignmentRulesState = initialState,
  action: TrackerModelBaseAction< AddCategoryAssignmentRulePayload & AddCategoryAssignmentRulesPayload>
): CategoryAssignmentRulesState => {
  switch (action.type) {
    case ADD_CATEGORY_ASSIGNMENT_RULE: {
      return {
        ...state,
        categoryAssignmentRules: [
          ...state.categoryAssignmentRules,
          action.payload.categoryAssignmentRule,
        ],
      };
    }
    case UPDATE_CATEGORY_ASSIGNMENT_RULE: {
      const updatedCategoryAsssignmentRule = action.payload.categoryAssignmentRule;
      return {
        ...state,
        categoryAssignmentRules: state.categoryAssignmentRules.map((categoryAssignmentRule) =>
          categoryAssignmentRule.id === updatedCategoryAsssignmentRule.id ? updatedCategoryAsssignmentRule : categoryAssignmentRule
        ),
      };
    }
    case DELETE_CATEGORY_ASSIGNMENT_RULE: {
      const deletedCategoryAssignmentRule = action.payload.categoryAssignmentRule;
      return {
        ...state,
        categoryAssignmentRules: state.categoryAssignmentRules.filter((categoryAssignmentRule) =>
          categoryAssignmentRule.id !== deletedCategoryAssignmentRule.id
        ),
      };
    }
    case ADD_CATEGORY_ASSIGNMENT_RULES: {
      const newState = cloneDeep(state) as CategoryAssignmentRulesState;
      newState.categoryAssignmentRules = newState.categoryAssignmentRules.concat(action.payload.categoryAssignmentRules);
      return newState;
    }
    default:
      return state;
  }
};
