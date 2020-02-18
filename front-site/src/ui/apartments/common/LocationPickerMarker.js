import React from 'react';
import PropTypes from 'prop-types';

const LocationPickerMarker = ({ lat, lng }) => (
  <img
    alt="marker"
    className="marker"
    src="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png"
    lat={lat}
    lng={lng}
  />
);

LocationPickerMarker.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
};

export default LocationPickerMarker;
