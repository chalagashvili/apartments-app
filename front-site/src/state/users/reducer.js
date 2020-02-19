import { SET_USERS, SET_USER_SINGLE } from 'state/users/types';

const reducer = (state = {}, action = {}) => {
  switch (action.type) {
    case SET_USERS:
      return {
        ...state,
        users: action.payload,
      };
    case SET_USER_SINGLE:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
