import { cloneDeep } from 'lodash';
import { Category, CategoryAssignmentRule, CategoryState } from '../types';
import { TrackerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_CATEGORY = 'ADD_CATEGORY';
export const ADD_CATEGORY_ASSIGNMENT_RULE = 'ADD_CATEGORY_ASSIGNMENT_RULE';
export const ADD_CATEGORIES = 'ADD_CATEGORIES';
export const ADD_CATEGORY_ASSIGNMENT_RULES = 'ADD_CATEGORY_ASSIGNMENT_RULES';
export const UPDATE_CATEGORY_ASSIGNMENT_RULE = 'UPDATE_CATEGORY_ASSIGNMENT_RULE';
export const DELETE_CATEGORY_ASSIGNMENT_RULE = 'DELETE_CATEGORY_ASSIGNMENT_RULE';

// ------------------------------------
// Actions
// ------------------------------------

interface AddCategoryPayload {
  category: Category,
}

export const addCategoryRedux = (category: Category): any => {
  return {
    type: ADD_CATEGORY,
    payload: {
      category
    }
  };
};

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

interface AddCategoriesPayload {
  categories: Category[];
}

export const addCategories = (
  categories: Category[],
): any => {
  return {
    type: ADD_CATEGORIES,
    payload: {
      categories
    }
  };
};

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

const initialState: CategoryState = {
  categories: [],
  categoryAssignmentRules: [],
};

export const categoryStateReducer = (
  state: CategoryState = initialState,
  action: TrackerModelBaseAction<AddCategoryPayload & AddCategoryAssignmentRulePayload & AddCategoriesPayload & AddCategoryAssignmentRulesPayload>
): CategoryState => {
  switch (action.type) {
    case ADD_CATEGORY: {
      return {
        ...state,
        categories: [
          ...state.categories,
          action.payload.category,
        ],
      };
    }
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
    case ADD_CATEGORIES: {
      return { ...state, categories: action.payload.categories };
    }
    case ADD_CATEGORY_ASSIGNMENT_RULES: {
      const newState = cloneDeep(state) as CategoryState;
      newState.categoryAssignmentRules = newState.categoryAssignmentRules.concat(action.payload.categoryAssignmentRules);
      return newState;
    }
    default:
      return state;
  }
};
