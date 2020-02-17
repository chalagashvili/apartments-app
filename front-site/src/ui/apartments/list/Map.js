import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';
import Marker from 'ui/apartments/list/Marker';
import { mapDefaultCenterCoordinates } from 'utils/const';

const MAP_KEY = process.env.REACT_APP_GOOGLE_MAP_KEY;
class SimpleMap extends PureComponent {
  render() {
    const {
      selectedItem, mapView, items, zoom, center, defaultCenter,
    } = this.props;
    return (
      // Important! Always set the container height explicitly
      <div
        className={mapView ? 'mapView' : 'map'}
        style={{
          height: '100vh', flex: 1, position: 'sticky', right: 0, top: 0,
        }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{ key: MAP_KEY }}
          zoom={zoom}
          defaultZoom={11}
          defaultCenter={defaultCenter}
          center={center}
        >
          {items.map(item => (
            <Marker
              key={item._id}
              active={item._id === selectedItem._id}
              lat={item.loc.coordinates[1]}
              lng={item.loc.coordinates[0]}
              name={item.name}
              onClick={this.props.onClick}
              item={item}
              selectedItem={selectedItem}
            />
          ))}
        </GoogleMapReact>
      </div>
    );
  }
}

SimpleMap.propTypes = {
  center: PropTypes.shape({}).isRequired,
  defaultCenter: PropTypes.shape({}),
  onClick: PropTypes.func.isRequired,
  selectedItem: PropTypes.shape({
    _id: PropTypes.string,
  }),
  zoom: PropTypes.number,
  items: PropTypes.arrayOf(PropTypes.shape({})),
  mapView: PropTypes.bool.isRequired,
};

SimpleMap.defaultProps = {
  defaultCenter: {
    lat: mapDefaultCenterCoordinates.latitude,
    lng: mapDefaultCenterCoordinates.longitude,
  },
  selectedItem: {},
  items: [],
  zoom: 11,
  // zoom: 11,
};

export default SimpleMap;

