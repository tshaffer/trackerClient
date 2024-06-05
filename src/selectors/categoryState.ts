import { CategoryEntity, TrackerState } from '../types';

export const getCategories = (state: TrackerState): CategoryEntity[] => {
  return state.categoryState.categories;
};
