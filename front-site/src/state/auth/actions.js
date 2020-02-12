import { postLogin, postSignUp } from 'api/auth';
import { setCookie } from 'utils';
import { SET_USER_AUTH_INFO } from 'state/auth/types';

export const setAuth = auth => ({
  type: SET_USER_AUTH_INFO,
  payload: auth,
});

export const sendPostLogin = data => dispatch => new Promise((resolve, reject) => {
  postLogin(data)
    .then((response) => {
      response.json().then((json) => {
        if (response.ok) {
          const { token, email, role } = json.payload;
          dispatch(setAuth({
            authenticated: true,
            role,
            email,
            token,
          }));
          setCookie('jwtToken', token);
          setCookie('email', email);
          setCookie('role', role);
        }
        resolve();
      });
    })
    .catch(() => { });
});

export const sendPostSignup = data => dispatch => new Promise((resolve, reject) => {
  postSignUp(data)
    .then((response) => {
      response.json().then((json) => {
        if (json.ok) {
          const { token, email, role } = json.payload;
          dispatch(setAuth({
            authenticated: true,
            role,
            email,
            token,
          }));
          setCookie('jwtToken', token);
          setCookie('email', email);
          setCookie('role', role);
        }
        resolve();
      });
    })
    .catch(() => { });
});