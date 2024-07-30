import { Category, CategoryState } from '../types';
import { TrackerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_CATEGORY = 'ADD_CATEGORY';
export const ADD_CATEGORIES = 'ADD_CATEGORIES';

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

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: CategoryState = {
  categories: [],
};

export const categoryStateReducer = (
  state: CategoryState = initialState,
  action: TrackerModelBaseAction<AddCategoryPayload & AddCategoriesPayload>
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
    case ADD_CATEGORIES: {
      return { ...state, categories: action.payload.categories };
    }
    default:
      return state;
  }
};
