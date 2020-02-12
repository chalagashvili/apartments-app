import { SET_USER_AUTH_INFO } from 'state/auth/types';

export const setAuth = auth => ({
  type: SET_USER_AUTH_INFO,
  payload: auth,
});
