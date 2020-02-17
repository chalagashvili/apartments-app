import { getOwnedApartments } from 'api/apartments';
import { SET_AVAILABLE_APARTMENTS, SET_OWNED_APARTMENTS } from 'state/apartments/types';
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

export const fetchOwnedApartments = paginationOptions => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    dispatch(toggleLoading('apartments'));
    const state = getState();
    const filters = getFilters(state, 'apartments') || {};
    const pagination = paginationOptions || getPagination(state);
    const params = generateQueryParams(filters, pagination);
    getOwnedApartments(params).then((response) => {
      dispatch(toggleLoading('apartments'));
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
      dispatch(toggleLoading('apartments'));
      reject();
    });
  });
