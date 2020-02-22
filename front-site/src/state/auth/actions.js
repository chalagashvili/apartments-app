import { postLogin, postSignUp, postResetPassword } from 'api/auth';
import { setCookie } from 'utils';
import { SET_USER_AUTH_INFO, CLEAR_AUTH_INFO, USER_LOGOUT } from 'state/auth/types';
import { toggleLoading } from 'state/loading/actions';

export const setAuth = auth => ({
  type: SET_USER_AUTH_INFO,
  payload: auth,
});

export const clearAuth = () => ({
  type: CLEAR_AUTH_INFO,
});

export const logout = () => ({
  type: USER_LOGOUT,
});

export const sendPostLogin = data => dispatch => new Promise((resolve, reject) => {
  dispatch(toggleLoading('login'));
  postLogin(data)
    .then((response) => {
      if (response.status === 401) {
        dispatch(toggleLoading('login'));
        return reject(new Error('Email or Password is incorrect'));
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
          dispatch(toggleLoading('login'));
          return resolve(json.payload);
        }
        dispatch(toggleLoading('login'));
        return reject(new Error(json.error));
      });
    })
    .catch(() => {
      dispatch(toggleLoading('login'));
      reject(new Error('Error occured when communicating with server'));
    });
});

export const sendPostSignup = data => dispatch => new Promise((resolve, reject) => {
  dispatch(toggleLoading('signup'));
  postSignUp(data)
    .then((response) => {
      response.json().then((json) => {
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
          dispatch(toggleLoading('signup'));
          return resolve(json.payload);
        }
        dispatch(toggleLoading('signup'));
        return reject(new Error(json.error));
      });
    })
    .catch(() => {
      dispatch(toggleLoading('signup'));
      reject(new Error('Error occured when communicating with server'));
    });
});

export const sendPostResetPassword = (data, token) => dispatch =>
  new Promise((resolve, reject) => {
    dispatch(toggleLoading('resetPassword'));
    postResetPassword(data, token).then(response => response.json().then((json) => {
      if (response.ok) {
        dispatch(toggleLoading('resetPassword'));
        return resolve();
      }
      dispatch(toggleLoading('resetPassword'));
      return reject(new Error(json.error));
    })).catch(() => {
      dispatch(toggleLoading('resetPassword'));
      reject(new Error('Error occured when communicating with server'));
    });
  });
