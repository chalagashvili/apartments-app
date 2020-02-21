import { getOwnedApartments, postApartment, getApartment, putApartment, deleteApartment, getAvailableApartments } from 'api/apartments';
import { SET_AVAILABLE_APARTMENTS, SET_OWNED_APARTMENTS,
  SET_EDIT_APARTMENT_LOCATION, SET_EDIT_APARTMENT, SET_EDIT_APARTMENT_ADDRESS,
  SET_BOOKED_APARTMENTS } from 'state/apartments/types';
import { toggleLoading } from 'state/loading/actions';
import { setPage } from 'state/pagination/actions';
import { generateQueryParams } from 'utils/index';
import { getFilters } from 'state/filters/selectors';
import { getPagination } from 'state/pagination/selectors';
import { getAddressByCoordinates } from 'api/services';

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

export const setEditApartmentAddress = apartment => ({
  type: SET_EDIT_APARTMENT_ADDRESS,
  payload: apartment,
});

export const fetchOwnedApartments = (paginationOptions, userId) => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    dispatch(toggleLoading('ownedApartments'));
    const state = getState();
    const filters = getFilters(state, 'ownedApartments') || {};
    const pagination = paginationOptions || getPagination(state);
    const params = generateQueryParams(filters, pagination);
    getOwnedApartments(params, userId).then(response => response.json().then((json) => {
      if (response.ok) {
        dispatch(setOwnedApartments(json.payload.data));
        dispatch(setPage(json.payload.metadata));
        dispatch(toggleLoading('ownedApartments'));
        return resolve();
      }
      dispatch(toggleLoading('ownedApartments'));
      return reject(new Error(json.error));
    })).catch(() => {
      dispatch(toggleLoading('ownedApartments'));
      reject(new Error('Error occured when communicating with server'));
    });
  });

export const sendPostApartment = (data, userId) => dispatch =>
  new Promise((resolve, reject) => {
    dispatch(toggleLoading('addApartment'));
    postApartment(data, userId).then(response => response.json().then((json) => {
      if (response.ok) {
        dispatch(toggleLoading('addApartment'));
        return resolve();
      }
      dispatch(toggleLoading('addApartment'));
      return reject(new Error(json.error));
    })).catch(() => {
      dispatch(toggleLoading('addApartment'));
      reject(new Error('Error occured when communicating with server'));
    });
  });

export const sendPutApartment = (data, apartmentId, userId) => dispatch =>
  new Promise((resolve, reject) => {
    dispatch(toggleLoading('editApartment'));
    putApartment(data, apartmentId, userId).then(response => response.json().then((json) => {
      if (response.ok) {
        dispatch(toggleLoading('editApartment'));
        return resolve();
      }
      dispatch(toggleLoading('editApartment'));
      return reject(new Error(json.error));
    })).catch(() => {
      dispatch(toggleLoading('editApartment'));
      reject(new Error('Error occured when communicating with server'));
    });
  });

export const fetchApartment = (apartmentId, userId) => dispatch =>
  new Promise((resolve, reject) => {
    dispatch(toggleLoading('editApartment'));
    getApartment(apartmentId, userId).then(response => response.json().then((json) => {
      if (response.ok) {
        dispatch(setEditApartment(json.payload));
        dispatch(toggleLoading('editApartment'));
        return resolve();
      }
      dispatch(toggleLoading('editApartment'));
      return reject(new Error(json.error));
    })).catch(() => {
      dispatch(toggleLoading('editApartment'));
      reject(new Error('Error occured when communicating with server'));
    });
  });

export const sendDeleteApartment = (apartmentId, userId) => dispatch =>
  new Promise((resolve, reject) => {
    dispatch(toggleLoading('editApartment'));
    deleteApartment(apartmentId, userId).then(response => response.json().then((json) => {
      if (response.ok) {
        dispatch(toggleLoading('editApartment'));
        return resolve();
      }
      dispatch(toggleLoading('editApartment'));
      return reject(new Error(json.error));
    })).catch(() => {
      dispatch(toggleLoading('editApartment'));
    });
  });

export const fetchAvailableApartments = paginationOptions => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    dispatch(toggleLoading('availableApartments'));
    const state = getState();
    const filters = getFilters(state, 'availableApartments') || {};
    const pagination = paginationOptions || getPagination(state);
    const params = generateQueryParams(filters, pagination);
    getAvailableApartments(params).then(response => response.json().then((json) => {
      if (response.ok) {
        dispatch(setAvailableApartments(json.payload.data));
        dispatch(setPage(json.payload.metadata));
        dispatch(toggleLoading('availableApartments'));
        return resolve();
      }
      dispatch(toggleLoading('availableApartments'));
      return reject(new Error(json.error));
    })).catch(() => {
      dispatch(toggleLoading('availableApartments'));
      reject(new Error('Error occured when communicating with server'));
    });
  });

export const fetchApartmentAddress = (lat, long) => dispatch => new Promise((resolve, reject) => {
  getAddressByCoordinates(lat, long)
    .then((response) => {
      response.json().then((json) => {
        const address = json && json.results &&
        json.results[0] && json.results[0].formatted_address ?
          json.results[0].formatted_address : '';
        dispatch(setEditApartmentAddress(address));
        resolve();
      });
    })
    .catch(() => {
      dispatch(setEditApartmentAddress(''));
      reject(new Error('Error occured when communicating with Google API'));
    });
});
