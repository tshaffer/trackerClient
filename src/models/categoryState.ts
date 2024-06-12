import { cloneDeep } from 'lodash';
import { CategoryEntity, CategoryKeywordEntity, CategoryState } from '../types';
import { TrackerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_CATEGORY = 'ADD_CATEGORY';
export const ADD_CATEGORY_KEYWORD = 'ADD_CATEGORY_KEYWORD';
export const ADD_CATEGORIES = 'ADD_CATEGORIES';
export const ADD_CATEGORY_KEYWORDS = 'ADD_CATEGORY_KEYWORDS';

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

interface AddCategoryKeywordPayload {
  categoryKeywordEntity: CategoryKeywordEntity,  
}

export const addCategoryKeywordRedux = (categoryKeywordEntity: CategoryKeywordEntity): any => {
  return {
    type: ADD_CATEGORY_KEYWORD,
    payload: {
      categoryKeywordEntity
    }
  };
}

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

interface AddCategoryKeywordsPayload {
  categoryKeywordEntities: CategoryKeywordEntity[];
}

export const addCategoryKeywords = (
  categoryKeywordEntities: CategoryKeywordEntity[],
): any => {
  return {
    type: ADD_CATEGORY_KEYWORDS,
    payload: {
      categoryKeywordEntities
    }
  };
};


// ------------------------------------
// Reducer
// ------------------------------------

const initialState: CategoryState = {
  categories: [],
  categoryKeywords: [],
};

export const categoryStateReducer = (
  state: CategoryState = initialState,
  action: TrackerModelBaseAction<AddCategoryPayload & AddCategoryKeywordPayload & AddCategoriesPayload & AddCategoryKeywordsPayload>
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
    case ADD_CATEGORY_KEYWORD: {
      return {
        ...state,
        categoryKeywords: [
          ...state.categoryKeywords,
          action.payload.categoryKeywordEntity,
        ],
      };
    }
    case ADD_CATEGORIES: {
      const newState = cloneDeep(state) as CategoryState;
      newState.categories = newState.categories.concat(action.payload.categories);
      return newState;
    }
    case ADD_CATEGORY_KEYWORDS: {
      const newState = cloneDeep(state) as CategoryState;
      newState.categoryKeywords = newState.categoryKeywords.concat(action.payload.categoryKeywordEntities);
      return newState;
    }
    default:
      return state;
  }
};
