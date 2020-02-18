import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import useOnclickOutside from 'react-cool-onclickoutside';

const PlacesAutocomplete = ({ setCurrentMarkerCoordinates }) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    // requestOptions: { /* Define search scope here */ }
    debounce: 300,
  });
  const ref = useRef();
  useOnclickOutside(ref, () => {
    // When user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions();
  });

  const handleInput = (e) => {
    // Update the keyword of the input element
    setValue(e.target.value);
  };

  const handleSelect = ({ description }) => () => {
    // When user selects a place, we can replace the keyword without request data from API
    // by setting the second parameter as "false"
    setValue(description, false);
    clearSuggestions();

    // Get latitude and longitude via utility functions
    getGeocode({ address: description })
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        setCurrentMarkerCoordinates(lng, lat);
      }).catch((error) => {
        console.log('😱 Error: ', error);
      });
  };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        id,
        // eslint-disable-next-line camelcase
        structured_formatting: { main_text: main, secondary_text: second },
      } = suggestion;

      return (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <li
          key={id}
          onClick={handleSelect(suggestion)}
          onKeyDown={handleSelect(suggestion)}
        >
          <strong>{main}</strong> <small>{second}</small>
        </li>
      );
    });

  return (
    <div ref={ref}>
      <input
        style={{ width: '100%' }}
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder="Whats is your apartment's address?"
      />
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === 'OK' && <ul>{renderSuggestions()}</ul>}
    </div>
  );
};

PlacesAutocomplete.propTypes = {
  setCurrentMarkerCoordinates: PropTypes.func.isRequired,
};

export default PlacesAutocomplete;
