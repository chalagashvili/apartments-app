import { getOwnedApartments, postApartment, getApartment, putApartment, deleteApartment, getAvailableApartments } from 'api/apartments';
import { SET_AVAILABLE_APARTMENTS, SET_OWNED_APARTMENTS,
  SET_EDIT_APARTMENT_LOCATION, SET_EDIT_APARTMENT,
  SET_BOOKED_APARTMENTS } from 'state/apartments/types';
import { toggleLoading } from 'state/loading/actions';
import { setPage } from 'state/pagination/actions';
import { generateQueryParams } from 'utils/index';
import { getFilters } from 'state/filters/selectors';
import { getPagination } from 'state/pagination/selectors';

export const setOwnedApartments = apartments => ({
  type: SET_OWNED_APARTMENTS,
  payload: apartments,
});

export const setAvailableApartments = apartments => ({
  type: SET_AVAILABLE_APARTMENTS,
  payload: apartments,
});

export const setBookedApartments = apartments => ({
  type: SET_BOOKED_APARTMENTS,
  payload: apartments,
});

export const setEditApartmentsLocation = location => ({
  type: SET_EDIT_APARTMENT_LOCATION,
  payload: location,
});

export const setEditApartment = apartment => ({
  type: SET_EDIT_APARTMENT,
  payload: apartment,
});

export const fetchOwnedApartments = (paginationOptions, userId) => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    dispatch(toggleLoading('ownedApartments'));
    const state = getState();
    const filters = getFilters(state, 'ownedApartments') || {};
    const pagination = paginationOptions || getPagination(state);
    const params = generateQueryParams(filters, pagination);
    getOwnedApartments(params, userId).then((response) => {
      dispatch(toggleLoading('ownedApartments'));
      // eslint-disable-next-line prefer-promise-reject-errors
      if (response.status === 401) return reject('You are not authorized');
      return response.json().then((json) => {
        if (response.ok) {
          dispatch(setOwnedApartments(json.payload.data));
          dispatch(setPage(json.payload.metadata));
          return resolve();
        }
        return reject(json.error);
      });
    }).catch(() => {
      dispatch(toggleLoading('ownedApartments'));
      reject();
    });
  });

export const sendPostApartment = (data, userId) => dispatch =>
  new Promise((resolve, reject) => {
    dispatch(toggleLoading('addApartment'));
    postApartment(data, userId).then((response) => {
      dispatch(toggleLoading('addApartment'));
      // eslint-disable-next-line prefer-promise-reject-errors
      if (response.status === 401) return reject('You are not authorized');
      return response.json().then((json) => {
        if (response.ok) {
          return resolve();
        }
        return reject(json.error);
      });
    }).catch(() => {
      dispatch(toggleLoading('addApartment'));
      reject();
    });
  });

export const sendPutApartment = (data, apartmentId, userId) => dispatch =>
  new Promise((resolve, reject) => {
    dispatch(toggleLoading('editApartment'));
    putApartment(data, apartmentId, userId).then((response) => {
      dispatch(toggleLoading('editApartment'));
      // eslint-disable-next-line prefer-promise-reject-errors
      if (response.status === 401) return reject('You are not authorized');
      return response.json().then((json) => {
        if (response.ok) {
          return resolve();
        }
        return reject(json.error);
      });
    }).catch(() => {
      dispatch(toggleLoading('editApartment'));
      reject();
    });
  });

export const fetchApartment = (apartmentId, userId) => dispatch =>
  new Promise((resolve, reject) => {
    dispatch(toggleLoading('editApartment'));
    getApartment(apartmentId, userId).then((response) => {
      dispatch(toggleLoading('editApartment'));
      // eslint-disable-next-line prefer-promise-reject-errors
      if (response.status === 401) return reject('You are not authorized');
      return response.json().then((json) => {
        if (response.ok) {
          dispatch(setEditApartment(json.payload));
          return resolve();
        }
        return reject(json.error);
      });
    }).catch(() => {
      dispatch(toggleLoading('editApartment'));
      reject();
    });
  });

export const sendDeleteApartment = (apartmentId, userId) => dispatch =>
  new Promise((resolve, reject) => {
    dispatch(toggleLoading('editApartment'));
    deleteApartment(apartmentId, userId).then((response) => {
      dispatch(toggleLoading('editApartment'));
      // eslint-disable-next-line prefer-promise-reject-errors
      if (response.status === 401) return reject('You are not authorized');
      return response.json().then((json) => {
        if (response.ok) {
          return resolve();
        }
        return reject(json.error);
      });
    }).catch(() => {
      dispatch(toggleLoading('editApartment'));
      reject();
    });
  });

export const fetchAvailableApartments = paginationOptions => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    dispatch(toggleLoading('availableApartments'));
    const state = getState();
    const filters = getFilters(state, 'availableApartments') || {};
    const pagination = paginationOptions || getPagination(state);
    const params = generateQueryParams(filters, pagination);
    getAvailableApartments(params).then((response) => {
      dispatch(toggleLoading('availableApartments'));
      // eslint-disable-next-line prefer-promise-reject-errors
      if (response.status === 401) return reject('You are not authorized');
      return response.json().then((json) => {
        if (response.ok) {
          dispatch(setAvailableApartments(json.payload.data));
          dispatch(setPage(json.payload.metadata));
          return resolve();
        }
        return reject(json.error);
      });
    }).catch(() => {
      dispatch(toggleLoading('availableApartments'));
      reject();
    });
  });
