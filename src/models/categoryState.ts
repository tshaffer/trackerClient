import { cloneDeep } from 'lodash';
import { CategoryEntity, CategoryState } from '../types';
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
  categoryEntity: CategoryEntity,  
}

export const addCategoryRedux = (categoryEntity: CategoryEntity): any => {
  return {
    type: ADD_CATEGORY,
    payload: {
      categoryEntity
    }
  };
};

interface AddCategoriesPayload {
  categories: CategoryEntity[];
}

export const addCategories = (
  categories: CategoryEntity[],
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
          action.payload.categoryEntity,
        ],
      };
    }
    case ADD_CATEGORIES: {
      const newState = cloneDeep(state) as CategoryState;
      newState.categories = newState.categories.concat(action.payload.categories);
      return newState;
    }
    default:
      return state;
  }
};
