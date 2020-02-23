import { toggleLoading, toggleGroupItemLoading } from 'state/loading/actions';
import { putUser, postBooking, getBookings,
  deleteBooking, getUsers, deleteUser, postNewUser, getUser } from 'api/users';
import { getFilters } from 'state/filters/selectors';
import { getPagination } from 'state/pagination/selectors';
import { generateQueryParams } from 'utils/index';
import { setBookedApartments } from 'state/apartments/actions';
import { setPage } from 'state/pagination/actions';
import { SET_USERS, SET_USER_SINGLE } from 'state/users/types';
import { defaultServerError } from 'utils/const';

export const setUsers = users => ({
  type: SET_USERS,
  payload: users,
});

export const setUser = users => ({
  type: SET_USER_SINGLE,
  payload: users,
});

export const sendPutUser = (data, userId) => dispatch =>
  new Promise((resolve, reject) => {
    dispatch(toggleLoading('editProfile'));
    putUser(data, userId).then(response => response.json().then((json) => {
      if (response.ok) {
        dispatch(toggleLoading('editProfile'));
        return resolve();
      }
      dispatch(toggleLoading('editProfile'));
      return reject(new Error(json.error));
    })).catch(() => {
      dispatch(toggleLoading('editProfile'));
      reject(new Error(defaultServerError));
    });
  });

export const sendPostBooking = (apartmentId, userId) => dispatch =>
  new Promise((resolve, reject) => {
    dispatch(toggleGroupItemLoading(apartmentId, 'book'));
    postBooking(apartmentId, userId).then(response => response.json().then((json) => {
      if (response.ok) {
        dispatch(toggleGroupItemLoading(apartmentId, 'book'));
        return resolve();
      }
      dispatch(toggleGroupItemLoading(apartmentId, 'book'));
      return reject(new Error(json.error));
    })).catch(() => {
      dispatch(toggleGroupItemLoading(apartmentId, 'book'));
      reject(new Error(defaultServerError));
    });
  });

export const sendDeleteBooking = (apartmentId, userId) => dispatch =>
  new Promise((resolve, reject) => {
    dispatch(toggleGroupItemLoading(apartmentId, 'book'));
    deleteBooking(apartmentId, userId).then(response => response.json().then((json) => {
      if (response.ok) {
        dispatch(toggleGroupItemLoading(apartmentId, 'book'));
        return resolve();
      }
      dispatch(toggleGroupItemLoading(apartmentId, 'book'));
      return reject(new Error(json.error));
    })).catch(() => {
      dispatch(toggleGroupItemLoading(apartmentId, 'book'));
      reject(new Error(defaultServerError));
    });
  });

export const fetchBookings = (paginationOptions, userId) => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    dispatch(toggleLoading('bookings'));
    const state = getState();
    const filters = getFilters(state, 'bookings') || {};
    const pagination = paginationOptions || getPagination(state);
    const params = generateQueryParams(filters, pagination);
    getBookings(params, userId).then(response => response.json().then((json) => {
      if (response.ok) {
        dispatch(setBookedApartments(json.payload.data));
        dispatch(setPage(json.payload.metadata));
        dispatch(toggleLoading('bookings'));
        return resolve();
      }
      dispatch(toggleLoading('bookings'));
      return reject(new Error(json.error));
    })).catch(() => {
      dispatch(toggleLoading('bookings'));
      reject(new Error(defaultServerError));
    });
  });

export const fetchUsers = paginationOptions => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    dispatch(toggleLoading('users'));
    const state = getState();
    const filters = {};
    const pagination = paginationOptions || getPagination(state);
    const params = generateQueryParams(filters, pagination);
    getUsers(params).then(response =>
      response.json().then((json) => {
        if (response.ok) {
          dispatch(setUsers(json.payload.data));
          dispatch(setPage(json.payload.metadata));
          dispatch(toggleLoading('users'));
          return resolve();
        }
        dispatch(toggleLoading('users'));
        return reject(new Error(json.error));
      })).catch(() => {
      dispatch(toggleLoading('users'));
      reject(new Error(defaultServerError));
    });
  });

export const sendDeleteUser = userId => dispatch =>
  new Promise((resolve, reject) => {
    dispatch(toggleGroupItemLoading(userId, 'deleteUser'));
    deleteUser(userId).then(response => response.json().then((json) => {
      if (response.ok) {
        dispatch(toggleGroupItemLoading(userId, 'deleteUser'));
        return resolve();
      }
      dispatch(toggleGroupItemLoading(userId, 'deleteUser'));
      return reject(new Error(json.error));
    })).catch(() => {
      dispatch(toggleGroupItemLoading(userId, 'deleteUser'));
      reject(new Error(defaultServerError));
    });
  });

export const sendPostNewUser = data => dispatch =>
  new Promise((resolve, reject) => {
    dispatch(toggleLoading('addUser'));
    postNewUser(data).then(response => response.json().then((json) => {
      if (response.ok) {
        dispatch(toggleLoading('addUser'));
        return resolve();
      }
      dispatch(toggleLoading('addUser'));
      return reject(new Error(json.error));
    })).catch(() => {
      dispatch(toggleLoading('addUser'));
      reject(new Error(defaultServerError));
    });
  });

export const fetchUser = (id, form) => dispatch =>
  new Promise((resolve, reject) => {
    dispatch(toggleLoading('editProfile'));
    getUser(id).then(response => response.json().then((json) => {
      if (response.ok) {
        const user = json.payload.data[0];
        dispatch(setUser(user));
        form.setFieldsValue({
          name: user.name,
          email: user.email,
          role: user.role,
        });
        dispatch(toggleLoading('editProfile'));
        return resolve();
      }
      dispatch(toggleLoading('editProfile'));
      return reject(new Error(json.error));
    })).catch(() => {
      dispatch(toggleLoading('editProfile'));
      reject(new Error(defaultServerError));
    });
  });
