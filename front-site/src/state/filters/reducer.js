import { SET_FILTER, REMOVE_FILTER } from 'state/filters/types';

const reducer = (state = {}, action = {}) => {
  switch (action.type) {
    case SET_FILTER: {
      const { name, key, value } = action.payload;
      const currentFiltersForName = state[name] || {};
      return {
        ...state,
        [name]: Object.assign({}, currentFiltersForName, {
          [key]: value,
        }),
      };
    }
    case REMOVE_FILTER: {
      const { name, key } = action.payload;
      const currentFiltersForName = state[name] || {};
      const { [key]: ignore, ...filtersWithoutKey } = currentFiltersForName;
      return {
        ...state,
        [name]: Object.assign({}, filtersWithoutKey),
      };
    }
    default: return state;
  }
};

export default reducer;
