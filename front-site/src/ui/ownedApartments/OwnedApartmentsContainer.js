import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { message } from 'antd';
import Apartments from 'ui/apartments/list/Apartments';
import { fetchOwnedApartments } from 'state/apartments/actions';
import { getOwnedApartments } from 'state/apartments/selectors';
import { getPagination } from 'state/pagination/selectors';
import { getLoading } from 'state/loading/selectors';
import { getAuthInfo } from 'state/auth/selectors';
import { ROUTE_EDIT_APARTMENT, ROUTE_ADMIN_EDIT_APARTMENT, ROUTE_ADMIN_ADD_APARTMENT } from 'app-init/router';
import { removeFilter, setFilter } from 'state/filters/actions';
import { getFilters } from 'state/filters/selectors';
import { RealtorOnly, defaultPagination } from 'utils/const';

const mapStateToProps = state => ({
  apartments: getOwnedApartments(state),
  pagination: getPagination(state),
  loading: getLoading(state).ownedApartments,
  auth: getAuthInfo(state),
  filters: getFilters(state, 'ownedApartments'),
  mode: RealtorOnly,
});

const mapDispatchToProps = (dispatch, { history, match: { params: { userId } } }) => ({
  onDidMount: () => {
    dispatch(fetchOwnedApartments(defaultPagination, userId))
      .catch(err => message.error(err.message));
  },
  onWillUnmount: () => {
    dispatch(removeFilter('ownedApartments', 'longitude'));
    dispatch(removeFilter('ownedApartments', 'latitude'));
    dispatch(removeFilter('ownedApartments', 'radius'));
  },
  onPaginationChange: (page, newPageSize) =>
    dispatch(fetchOwnedApartments({ page, pageSize: newPageSize }, userId))
      .catch(err => message.error(err.message)),
  onPageChange: (newPage, pageSize) =>
    dispatch(fetchOwnedApartments({ page: newPage, pageSize }, userId))
      .catch(err => message.error(err.message)),
  onEdit: (id) => {
    const routePath = userId ?
      ROUTE_ADMIN_EDIT_APARTMENT.replace(':userId', userId).replace(':apartmentId', id) :
      ROUTE_EDIT_APARTMENT.replace(':apartmentId', id);
    history.push(routePath);
  },
  onAdd: () => history.push(ROUTE_ADMIN_ADD_APARTMENT.replace(':userId', userId)),
  onFilterChange: (key, val) => {
    if (val == null) {
      dispatch(removeFilter('ownedApartments', key));
    } else {
      dispatch(setFilter('ownedApartments', key, val));
    }
  },
  onFilter: () => dispatch(fetchOwnedApartments(defaultPagination, userId))
    .catch(err => message.error(err.message)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Apartments));
