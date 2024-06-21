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
export const UPDATE_CATEGORY_KEYWORD = 'UPDATE_CATEGORY_KEYWORD';
export const DELETE_CATEGORY_KEYWORD = 'DELETE_CATEGORY_KEYWORD';

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

export const updateCategoryKeywordRedux = (categoryKeywordEntity: CategoryKeywordEntity): any => {
  return {
    type: UPDATE_CATEGORY_KEYWORD,
    payload: {
      categoryKeywordEntity
    }
  };
}

export const deleteCategoryKeywordRedux = (categoryKeywordEntity: CategoryKeywordEntity): any => {
  return {
    type: DELETE_CATEGORY_KEYWORD,
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
    case UPDATE_CATEGORY_KEYWORD: {
      const updatedKeyword = action.payload.categoryKeywordEntity;
      return {
        ...state,
        categoryKeywords: state.categoryKeywords.map((keyword) =>
          keyword.id === updatedKeyword.id ? updatedKeyword : keyword
        ),
      };
    }
    case DELETE_CATEGORY_KEYWORD: {
      const deletedKeyword = action.payload.categoryKeywordEntity;
      return {
        ...state,
        categoryKeywords: state.categoryKeywords.filter((keyword) =>
          keyword.id !== deletedKeyword.id
        ),
      };
    }
    case ADD_CATEGORIES: {
      return { ...state, categories: action.payload.categories };
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
