import { SET_PROFILE } from 'state/profile/types';
import { USER_LOGOUT } from 'state/auth/types';

const reducer = (state = {}, action = {}) => {
  switch (action.type) {
    case SET_PROFILE:
      return action.payload;
    case USER_LOGOUT: {
      return {};
    }
    default:
      return state;
  }
};

export default reducer;
