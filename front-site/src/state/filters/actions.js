import { SET_FILTER, REMOVE_FILTER } from 'state/filters/types';

export const setFilter = (name, key, value) => ({
  type: SET_FILTER,
  payload: {
    name,
    key,
    value,
  },
});

export const removeFilter = (name, key) => ({
  type: REMOVE_FILTER,
  payload: {
    name,
    key,
  },
});
