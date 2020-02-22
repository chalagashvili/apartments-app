import { TOGGLE_LOADING, TOGGLE_GROUP_ITEM_LOADING } from 'state/loading/types';
import { USER_LOGOUT } from 'state/auth/types';

const reducer = (state = {}, action = {}) => {
  switch (action.type) {
    case TOGGLE_LOADING: {
      const { id } = action.payload;
      return { ...state, [id]: !state[id] };
    }

    case TOGGLE_GROUP_ITEM_LOADING: {
      const { group, id } = action.payload;

      const groupNameTaken = (state[group] && typeof state[group] !== 'object');
      if (!groupNameTaken) {
        const groupExists = (state[group] && typeof state[group] === 'object');
        return {
          ...state,
          [group]: {
            ...state[group],
            [id]: groupExists ? !state[group][id] : true,
          },
        };
      }
      return state;
    }
    case USER_LOGOUT: {
      return {};
    }
    default:
      return state;
  }
};

export default reducer;
