import { postLogin, postSignUp, postResetPassword } from 'api/auth';
import { setCookie } from 'utils';
import { SET_USER_AUTH_INFO, CLEAR_AUTH_INFO } from 'state/auth/types';
import { toggleLoading } from 'state/loading/actions';

export const setAuth = auth => ({
  type: SET_USER_AUTH_INFO,
  payload: auth,
});

export const clearAuth = () => ({
  type: CLEAR_AUTH_INFO,
});

export const sendPostLogin = data => dispatch => new Promise((resolve, reject) => {
  dispatch(toggleLoading('login'));
  postLogin(data)
    .then((response) => {
      dispatch(toggleLoading('login'));
      if (response.status === 401) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return reject('Email or Password is incorrect');
      }
      return response.json().then((json) => {
        if (response.ok) {
          const {
            token, email, role, id,
          } = json.payload;
          setCookie('jwtToken', token);
          setCookie('email', email);
          setCookie('role', role);
          setCookie('id', id);
          dispatch(setAuth({
            authenticated: true,
            role,
            email,
            token,
            id,
          }));
          return resolve(json.payload);
        }
        return reject(json.error);
      });
    })
    .catch(() => {
      dispatch(toggleLoading('login'));
    });
});

export const sendPostSignup = data => dispatch => new Promise((resolve, reject) => {
  dispatch(toggleLoading('signup'));
  postSignUp(data)
    .then((response) => {
      response.json().then((json) => {
        if (json.ok) {
          const {
            token, email, role, id,
          } = json.payload;
          setCookie('jwtToken', token);
          setCookie('email', email);
          setCookie('role', role);
          setCookie('id', id);
          dispatch(setAuth({
            authenticated: true,
            role,
            email,
            token,
            id,
          }));
          resolve(json.payload);
        } else {
          reject(json.error);
        }
        dispatch(toggleLoading('signup'));
      });
    })
    .catch(() => {
      dispatch(toggleLoading('signup'));
    });
});

export const sendPostResetPassword = (data, token) => dispatch =>
  new Promise((resolve, reject) => {
    dispatch(toggleLoading('resetPassword'));
    postResetPassword(data, token).then((response) => {
      dispatch(toggleLoading('resetPassword'));
      // eslint-disable-next-line prefer-promise-reject-errors
      if (response.status === 401) return reject('You are not authorized');
      return response.json().then((json) => {
        if (response.ok) {
          return resolve();
        }
        return reject(json.error);
      });
    }).catch(() => {
      dispatch(toggleLoading('resetPassword'));
      reject();
    });
  });
