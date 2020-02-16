import React, { PureComponent } from 'react';
import GoogleMapReact from 'google-map-react';
import Marker from './Marker';

class SimpleMap extends PureComponent {
  static defaultProps = {
    center: {
      lat: -37.9722342,
      lng: 144.7729561,
    },
    zoom: 11,
  };

  render() {
    const { selectedItem, mapView } = this.props;

    return (
      // Important! Always set the container height explicitly
      <div
        className={mapView ? 'mapView' : 'map'}
        style={{
          height: '100vh', flex: 1, position: 'sticky', right: 0, top: 0,
        }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyCbTP4oavyejp7WPxkkjuS2H0eX0mKhya0' }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          {this.props.data.map(item => (

            <Marker
              lat={item.lat}
              lng={item.lng}
              active={!!(item.lng === selectedItem.lng && item.lat === selectedItem.lat)}
              name="My Marker"
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

export default SimpleMap;

