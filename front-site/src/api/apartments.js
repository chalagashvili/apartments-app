import Cookies from 'js-cookie';

const api = process.env.REACT_APP_API_URL;

// eslint-disable-next-line import/prefer-default-export
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
