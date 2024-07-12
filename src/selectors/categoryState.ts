import { Category, CategoryAssignmentRule, TrackerState } from '../types';

export const getCategories = (state: TrackerState): Category[] => {
  return state.categoryState.categories;
};

export const getCategoryById = (state: TrackerState, id: string): Category | undefined => {
  return state.categoryState.categories.find(category => category.id === id);
}

export const getCategoryByName = (state: TrackerState, name: string): Category | undefined => {
  return state.categoryState.categories.find(category => category.name === name);
}

export const getCategoryDisregardLevel = (state: TrackerState, id: string): number => {
  const category = getCategoryById(state, id);
  return category ? category.disregardLevel : 0;
}

export const getCategoryAssignmentRules = (state: TrackerState): CategoryAssignmentRule[] => {
  return state.categoryState.categoryAssignmentRules;
};

