import React from 'react';
import { Spin } from 'antd';
import PropTypes from 'prop-types';
import MapContainer from 'ui/apartments/list/Map';
import AparmentsList from 'ui/apartments/list/ApartmentsList';
import { mapDefaultCenterCoordinates } from 'utils/const';

class Apartments extends React.PureComponent {
  state = {
    selectedItem: {},
    mapView: false,
    searchByMap: false,
    centerCoordinates: mapDefaultCenterCoordinates,
  };

  componentDidMount() {
    const { onDidMount } = this.props;
    onDidMount();
    navigator.geolocation.getCurrentPosition((position) => {
      if (position && position.coords) {
        const { longitude, latitude } = position;
        if (longitude != null && latitude != null) {
          const centerCoordinates = {
            longitude,
            latitude,
          };
          this.setState({ centerCoordinates });
        }
      }
    });
  }

  showInfo = (selectedItem) => {
    this.setState({ selectedItem });
  }

  render() {
    const {
      mapView, selectedItem, searchByMap, centerCoordinates: { longitude, latitude },
    } = this.state;
    const {
      apartments, pagination, onPageChange, onPaginationChange, loading,
    } = this.props;
    return (
      <Spin spinning={!!loading}>
        <div className="apartmentsForm" >
          <AparmentsList
            pagination={pagination}
            onPageChange={onPageChange}
            onPaginationChange={onPaginationChange}
            mapView={mapView}
            items={apartments}
            onHover={this.showInfo}
            searchByMap={searchByMap}
            searchByMapToggle={
            () => this.setState(prevState => ({ searchByMap: !prevState.searchByMap }))}
          />
          <MapContainer
            pagination={pagination}
            mapView={mapView}
            center={{ lat: latitude, lng: longitude }}
            items={apartments}
            onClick={this.showInfo}
            selectedItem={selectedItem}
          />
          <div
            className="apartmentsForm__view"
            role="button"
            tabIndex={-1}
            onClick={() => this.setState(prevState => ({ mapView: !prevState.mapView }))}
            onKeyDown={() => this.setState(prevState => ({ mapView: !prevState.mapView }))}
          > {mapView ? 'LIST' : 'MAP'}
          </div>
        </div>
      </Spin>
    );
  }
}

Apartments.propTypes = {
  apartments: PropTypes.arrayOf(PropTypes.shape({})),
  onDidMount: PropTypes.func.isRequired,
  pagination: PropTypes.shape({}).isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPaginationChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

Apartments.defaultProps = {
  apartments: [],
  loading: false,
};

export default Apartments;

