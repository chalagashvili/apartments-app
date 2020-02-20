// eslint-disable-next-line import/prefer-default-export
export const getAddressByCoordinates = (lat, lng) => new Promise((resolve, reject) => {
  fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAP_KEY}&language=en`,
    {
      method: 'GET',
      cache: 'no-cache',
      referrerPolicy: 'no-referrer',
    },
  )
    .then(res => resolve(res))
    .catch(err => reject(err));
});
