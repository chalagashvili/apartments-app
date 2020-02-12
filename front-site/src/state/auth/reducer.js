import { SET_USER_AUTH_INFO } from 'state/auth/types';

const initialState = {
  username: null,
  authenticated: true,
  role: null,
};

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_USER_AUTH_INFO:
      return action.payload;
    default: return state;
  }
};

export default reducer;
