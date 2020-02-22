import { SET_USER_AUTH_INFO, CLEAR_AUTH_INFO, USER_LOGOUT } from 'state/auth/types';

const initialState = {
  auth: {
    email: null,
    authenticated: false,
    role: null,
    token: null,
  },
};

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_USER_AUTH_INFO:
      return action.payload;
    case CLEAR_AUTH_INFO:
      return {};
    case USER_LOGOUT: {
      return initialState;
    }
    default: return state;
  }
};

export default reducer;
