import { CategoryEntity, CategoryKeywordEntity, TrackerState } from '../types';

export const getCategories = (state: TrackerState): CategoryEntity[] => {
  return state.categoryState.categories;
};

export const getCategoryById = (state: TrackerState, id: string): CategoryEntity | undefined => {
  return state.categoryState.categories.find(category => category.id === id);
}

export const getCategoryDisregardLevel = (state: TrackerState, id: string): number => {
  const category = getCategoryById(state, id);
  return category ? category.disregardLevel : 0;
}

export const getCategoryKeywordEntities = (state: TrackerState): CategoryKeywordEntity[] => {
  return state.categoryState.categoryKeywords;
};

