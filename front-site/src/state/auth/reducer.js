import { SET_USER_AUTH_INFO, CLEAR_AUTH_INFO } from 'state/auth/types';

const initialState = {
  auth: {
    username: null,
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
    default: return state;
  }
};

export default reducer;
