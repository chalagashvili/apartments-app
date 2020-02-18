import Cookies from 'js-cookie';

const api = process.env.REACT_APP_API_URL;

export const getOwnedApartments = (params = '', id = Cookies.get('id')) => new Promise((resolve, reject) => {
  fetch(`${api}/users/${id}/apartments/${params}`, {
    method: 'GET',
    cache: 'no-cache',
    headers: {
      authorization: Cookies.get('jwtToken'),
      'Content-Type': 'application/json',
    },
    referrerPolicy: 'no-referrer',
  })
    .then(res => resolve(res))
    .catch(err => reject(err));
});

export const postApartment = (data, id = Cookies.get('id')) => new Promise((resolve, reject) => {
  fetch(`${api}/users/${id}/apartments`, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      authorization: Cookies.get('jwtToken'),
      'Content-Type': 'application/json',
    },
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data),
  })
    .then(res => resolve(res))
    .catch(err => reject(err));
});

export const getApartment = (apartmentId, id = Cookies.get('id')) => new Promise((resolve, reject) => {
  fetch(`${api}/users/${id}/apartments/${apartmentId}`, {
    method: 'GET',
    cache: 'no-cache',
    headers: {
      authorization: Cookies.get('jwtToken'),
      'Content-Type': 'application/json',
    },
    referrerPolicy: 'no-referrer',
  })
    .then(res => resolve(res))
    .catch(err => reject(err));
});

export const putApartment = (data, apartmentId, id = Cookies.get('id')) => new Promise((resolve, reject) => {
  fetch(`${api}/users/${id}/apartments/${apartmentId}`, {
    method: 'PUT',
    cache: 'no-cache',
    headers: {
      authorization: Cookies.get('jwtToken'),
      'Content-Type': 'application/json',
    },
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data),
  })
    .then(res => resolve(res))
    .catch(err => reject(err));
});

export const deleteApartment = (apartmentId, id = Cookies.get('id')) => new Promise((resolve, reject) => {
  fetch(`${api}/users/${id}/apartments/${apartmentId}`, {
    method: 'DELETE',
    cache: 'no-cache',
    headers: {
      authorization: Cookies.get('jwtToken'),
      'Content-Type': 'application/json',
    },
    referrerPolicy: 'no-referrer',
  })
    .then(res => resolve(res))
    .catch(err => reject(err));
});
