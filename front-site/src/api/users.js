import Cookies from 'js-cookie';

const api = process.env.REACT_APP_API_URL;

export const putUser = (data, id = Cookies.get('id')) => new Promise((resolve, reject) => {
  fetch(`${api}/users/${id}`, {
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

export const postBooking = (apartmentId, id = Cookies.get('id')) => new Promise((resolve, reject) => {
  fetch(`${api}/users/${id}/bookings/${apartmentId}`, {
    method: 'POST',
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

export const getBookings = (params, id = Cookies.get('id')) => new Promise((resolve, reject) => {
  fetch(`${api}/users/${id}/bookings/${params}`, {
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

export const deleteBooking = (apartmentId, id = Cookies.get('id')) => new Promise((resolve, reject) => {
  fetch(`${api}/users/${id}/bookings/${apartmentId}`, {
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

export const getUsers = params => new Promise((resolve, reject) => {
  fetch(`${api}/users/${params}`, {
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

export const deleteUser = id => new Promise((resolve, reject) => {
  fetch(`${api}/users/${id}`, {
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

export const postNewUser = data => new Promise((resolve, reject) => {
  fetch(`${api}/users`, {
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

export const getUser = id => new Promise((resolve, reject) => {
  fetch(`${api}/users/${id}`, {
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
