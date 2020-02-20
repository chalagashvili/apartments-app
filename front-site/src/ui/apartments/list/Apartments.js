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
      apartments, pagination, onPageChange, onPaginationChange, loading, auth, onEdit,
      onFilterChange, onFilter, filters, onBook, groupLoading, onUnBook, mode, onAdd,
    } = this.props;
    return (
      <Spin spinning={!!loading}>
        <div className="apartmentsForm" >
          <AparmentsList
            auth={auth}
            onBook={onBook}
            onUnBook={onUnBook}
            groupLoading={groupLoading}
            onFilter={onFilter}
            onEdit={onEdit}
            mode={mode}
            filters={filters}
            pagination={pagination}
            onPageChange={onPageChange}
            onPaginationChange={onPaginationChange}
            mapView={mapView}
            onAdd={onAdd}
            onFilterChange={onFilterChange}
            items={apartments}
            onHover={this.showInfo}
            searchByMap={searchByMap}
            searchByMapToggle={
            () => {
              if (this.state.searchByMap) {
                onFilterChange('longitude');
                onFilterChange('latitude');
                onFilterChange('radius');
              }
              this.setState(prevState => ({ searchByMap: !prevState.searchByMap }));
              }
            }
          />
          <MapContainer
            auth={auth}
            onBook={onBook}
            onUnBook={onUnBook}
            groupLoading={groupLoading}
            onFilter={onFilter}
            onEdit={onEdit}
            pagination={pagination}
            searchByMap={searchByMap}
            onFilterChange={onFilterChange}
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
  onEdit: PropTypes.func,
  apartments: PropTypes.arrayOf(PropTypes.shape({})),
  onDidMount: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  pagination: PropTypes.shape({}).isRequired,
  onPageChange: PropTypes.func.isRequired,
  onFilter: PropTypes.func.isRequired,
  onPaginationChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  auth: PropTypes.shape({
    role: PropTypes.string,
  }),
  filters: PropTypes.shape({}),
  onBook: PropTypes.func,
  onUnBook: PropTypes.func,
  onAdd: PropTypes.func,
  groupLoading: PropTypes.shape({}),
  mode: PropTypes.string.isRequired,
};

Apartments.defaultProps = {
  apartments: [],
  loading: false,
  auth: {
    role: '',
  },
  filters: {},
  onBook: () => {},
  onUnBook: () => {},
  groupLoading: {},
  onEdit: () => {},
  onAdd: () => {},
};

export default Apartments;

