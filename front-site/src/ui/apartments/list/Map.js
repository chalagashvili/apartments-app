import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';
import Marker from 'ui/apartments/list/Marker';
import { mapDefaultCenterCoordinates } from 'utils/const';

const MAP_KEY = process.env.REACT_APP_GOOGLE_MAP_KEY;
class SimpleMap extends PureComponent {
  filterWithNewCenter(map) {
    const { onFilterChange, onFilter, searchByMap } = this.props;
    const longitude = map.center.lng();
    const latitude = map.center.lat();
    if (searchByMap) {
      onFilterChange('longitude', longitude.toFixed(6));
      onFilterChange('latitude', latitude.toFixed(6));
      // Convert radians to kms (so, below is 50km range)
      onFilterChange('radius', (50 / 6378).toFixed(7));
      onFilter();
    }
  }


  render() {
    const {
      selectedItem, mapView, items, zoom, center, defaultCenter,
      auth, onEdit, onBook, groupLoading, onUnBook,
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
          onDragEnd={map => this.filterWithNewCenter(map)}
          defaultCenter={defaultCenter}
          center={center}
        >
          {items.map(item => (
            <Marker
              auth={auth}
              onEdit={onEdit}
              key={item._id}
              active={item._id === selectedItem._id}
              lat={item.loc.coordinates[1]}
              lng={item.loc.coordinates[0]}
              groupLoading={groupLoading}
              name={item.name}
              onBook={onBook}
              onUnBook={onUnBook}
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
  auth: PropTypes.shape({
    role: PropTypes.string,
  }).isRequired,
  searchByMap: PropTypes.bool,
  center: PropTypes.shape({}).isRequired,
  defaultCenter: PropTypes.shape({}),
  onClick: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onFilterChange: PropTypes.func.isRequired,
  onFilter: PropTypes.func.isRequired,
  selectedItem: PropTypes.shape({
    _id: PropTypes.string,
  }),
  zoom: PropTypes.number,
  items: PropTypes.arrayOf(PropTypes.shape({})),
  mapView: PropTypes.bool.isRequired,
  onBook: PropTypes.func,
  onUnBook: PropTypes.func,
  groupLoading: PropTypes.shape({}),
};

SimpleMap.defaultProps = {
  defaultCenter: {
    lat: mapDefaultCenterCoordinates.latitude,
    lng: mapDefaultCenterCoordinates.longitude,
  },
  selectedItem: {},
  items: [],
  zoom: 11,
  onEdit: () => {},
  searchByMap: false,
  onBook: () => {},
  onUnBook: () => {},
  groupLoading: {},
};

export default SimpleMap;

