import { toggleLoading, toggleGroupItemLoading } from 'state/loading/actions';
import { putUser, postBooking, getBookings, deleteBooking, getUsers, deleteUser, postNewUser } from 'api/users';
import { getFilters } from 'state/filters/selectors';
import { getPagination } from 'state/pagination/selectors';
import { generateQueryParams } from 'utils/index';
import { setBookedApartments } from 'state/apartments/actions';
import { setPage } from 'state/pagination/actions';
import { SET_USERS, SET_USER_SINGLE } from 'state/users/types';

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
    putUser(data, userId).then((response) => {
      dispatch(toggleLoading('editProfile'));
      // eslint-disable-next-line prefer-promise-reject-errors
      if (response.status === 401) return reject('You are not authorized');
      return response.json().then((json) => {
        if (response.ok) {
          return resolve();
        }
        return reject(json.error);
      });
    }).catch(() => {
      dispatch(toggleLoading('editProfile'));
      reject();
    });
  });

export const sendPostBooking = (apartmentId, userId) => dispatch =>
  new Promise((resolve, reject) => {
    dispatch(toggleGroupItemLoading(apartmentId, 'book'));
    postBooking(apartmentId, userId).then((response) => {
      dispatch(toggleGroupItemLoading(apartmentId, 'book'));
      // eslint-disable-next-line prefer-promise-reject-errors
      if (response.status === 401) return reject('You are not authorized');
      return response.json().then((json) => {
        if (response.ok) {
          return resolve();
        }
        return reject(json.error);
      });
    }).catch(() => {
      dispatch(toggleGroupItemLoading(apartmentId, 'book'));
      reject();
    });
  });

export const sendDeleteBooking = (apartmentId, userId) => dispatch =>
  new Promise((resolve, reject) => {
    dispatch(toggleGroupItemLoading(apartmentId, 'book'));
    deleteBooking(apartmentId, userId).then((response) => {
      dispatch(toggleGroupItemLoading(apartmentId, 'book'));
      // eslint-disable-next-line prefer-promise-reject-errors
      if (response.status === 401) return reject('You are not authorized');
      return response.json().then((json) => {
        if (response.ok) {
          return resolve();
        }
        return reject(json.error);
      });
    }).catch(() => {
      dispatch(toggleGroupItemLoading(apartmentId, 'book'));
      reject();
    });
  });

export const fetchBookings = paginationOptions => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    dispatch(toggleLoading('bookings'));
    const state = getState();
    const filters = getFilters(state, 'bookings') || {};
    const pagination = paginationOptions || getPagination(state);
    const params = generateQueryParams(filters, pagination);
    getBookings(params).then((response) => {
      dispatch(toggleLoading('bookings'));
      // eslint-disable-next-line prefer-promise-reject-errors
      if (response.status === 401) return reject('You are not authorized');
      return response.json().then((json) => {
        if (response.ok) {
          dispatch(setBookedApartments(json.payload.data));
          dispatch(setPage(json.payload.metadata));
          return resolve();
        }
        return reject(json.error);
      });
    }).catch(() => {
      dispatch(toggleLoading('bookings'));
      reject();
    });
  });

export const fetchUsers = paginationOptions => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    dispatch(toggleLoading('users'));
    const state = getState();
    const filters = {};
    const pagination = paginationOptions || getPagination(state);
    const params = generateQueryParams(filters, pagination);
    getUsers(params).then((response) => {
      dispatch(toggleLoading('users'));
      // eslint-disable-next-line prefer-promise-reject-errors
      if (response.status === 401) return reject('You are not authorized');
      return response.json().then((json) => {
        if (response.ok) {
          dispatch(setUsers(json.payload.data));
          dispatch(setPage(json.payload.metadata));
          return resolve();
        }
        return reject(json.error);
      });
    }).catch(() => {
      dispatch(toggleLoading('users'));
      reject();
    });
  });

export const sendDeleteUser = userId => dispatch =>
  new Promise((resolve, reject) => {
    dispatch(toggleGroupItemLoading(userId, 'deleteUser'));
    deleteUser(userId).then((response) => {
      dispatch(toggleGroupItemLoading(userId, 'deleteUser'));
      // eslint-disable-next-line prefer-promise-reject-errors
      if (response.status === 401) return reject('You are not authorized');
      return response.json().then((json) => {
        if (response.ok) {
          return resolve();
        }
        return reject(json.error);
      });
    }).catch(() => {
      dispatch(toggleGroupItemLoading(userId, 'deleteUser'));
      reject();
    });
  });

export const sendPostNewUser = data => dispatch =>
  new Promise((resolve, reject) => {
    dispatch(toggleLoading('addUser'));
    postNewUser(data).then((response) => {
      dispatch(toggleLoading('addUser'));
      // eslint-disable-next-line prefer-promise-reject-errors
      if (response.status === 401) return reject('You are not authorized');
      return response.json().then((json) => {
        if (response.ok) {
          return resolve();
        }
        return reject(json.error);
      });
    }).catch(() => {
      dispatch(toggleLoading('addUser'));
      reject();
    });
  });

export const fetchUser = (id, form) => dispatch =>
  new Promise((resolve, reject) => {
    dispatch(toggleLoading('editProfile'));
    getUsers(id).then((response) => {
      dispatch(toggleLoading('editProfile'));
      // eslint-disable-next-line prefer-promise-reject-errors
      if (response.status === 401) return reject('You are not authorized');
      return response.json().then((json) => {
        if (response.ok) {
          const user = json.payload.data[0];
          dispatch(setUser());
          form.setFieldsValue({
            name: user.name,
            email: user.email,
            role: user.role,
          });
          return resolve();
        }
        return reject(json.error);
      });
    }).catch(() => {
      dispatch(toggleLoading('editProfile'));
      reject();
    });
  });
