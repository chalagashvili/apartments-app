import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GoogleMap from 'google-map-react';
import LocationPickerMarker from 'ui/apartments/common/LocationPickerMarker';

import './styles.css';

class LocationPicker extends Component {
  constructor(props) {
    super(props);
    const { centerCoordinates: { longitude, latitude } } = this.props;
    const center = {
      lng: longitude,
      lat: latitude,
    };
    this.state = {
      center,
      markerCenter: center,
      draggable: true,
    };
  }

  componentWillUpdate(nextProps) {
    if (this.props.currentMarkerCoordinates !== nextProps.currentMarkerCoordinates) {
      const newPos = {
        lng: nextProps.currentMarkerCoordinates.longitude,
        lat: nextProps.currentMarkerCoordinates.latitude,
      };
      // eslint-disable-next-line react/no-will-update-set-state
      this.setState({
        markerCenter: newPos,
        center: newPos,
      });
    }
  }

  onMouseDown = () => {
    this.setState({ draggable: false });
  }

  onMouseMove = (childKey, childProps, mouse) => {
    this.setState({
      markerCenter: mouse,
    });
  }

  onMouseUp = (childKey, childProps, mouse) => {
    const { setCurrentMarkerCoordinates } = this.props;
    this.setState({
      markerCenter: mouse,
      center: mouse,
      draggable: true,
    });
    setCurrentMarkerCoordinates(mouse.lng, mouse.lat);
  }

  render() {
    return (
      <div className="Mapp">
        <GoogleMap
          zoom={11}
          center={this.state.center}
          draggable={this.state.draggable}
          onChildMouseDown={this.onMouseDown}
          onChildMouseMove={this.onMouseMove}
          onChildMouseUp={this.onMouseUp}
        >
          <LocationPickerMarker
            lat={this.state.markerCenter.lat}
            lng={this.state.markerCenter.lng}
          />
        </GoogleMap>
      </div>
    );
  }
}

LocationPicker.propTypes = {
  centerCoordinates: PropTypes.shape({
    longitude: PropTypes.number.isRequired,
    latitude: PropTypes.number.isRequired,
  }).isRequired,
  setCurrentMarkerCoordinates: PropTypes.func.isRequired,
  currentMarkerCoordinates: PropTypes.shape({
    longitude: PropTypes.number,
    latitude: PropTypes.number,
  }).isRequired,
};

export default LocationPicker;
