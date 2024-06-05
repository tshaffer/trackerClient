import { CategoryEntity, CategoryState } from '../types';
import { TrackerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_CATEGORY = 'ADD_CATEGORY';

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

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: CategoryState = {
  categories: [],
};

export const categoryStateReducer = (
  state: CategoryState = initialState,
  action: TrackerModelBaseAction<AddCategoryPayload>
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
    default:
      return state;
  }
};
