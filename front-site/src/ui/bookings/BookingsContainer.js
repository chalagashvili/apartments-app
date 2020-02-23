import { connect } from 'react-redux';
import { message } from 'antd';
import { withRouter } from 'react-router-dom';
import Apartments from 'ui/apartments/list/Apartments';
import { getBookedApartments } from 'state/apartments/selectors';
import { getPagination } from 'state/pagination/selectors';
import { getLoading } from 'state/loading/selectors';
import { getAuthInfo } from 'state/auth/selectors';
import { removeFilter, setFilter } from 'state/filters/actions';
import { getFilters } from 'state/filters/selectors';
import { fetchBookings, sendDeleteBooking } from 'state/users/actions';
import { ROUTE_EDIT_APARTMENT } from 'app-init/router';
import { ClientOnly } from 'utils/const';

const mapStateToProps = state => ({
  apartments: getBookedApartments(state),
  pagination: getPagination(state),
  loading: getLoading(state).bookings,
  groupLoading: getLoading(state).book,
  auth: getAuthInfo(state),
  filters: getFilters(state, 'bookings'),
  mode: ClientOnly,
});

const mapDispatchToProps = (dispatch, { history, match: { params: { userId } } }) => ({
  onDidMount: () => {
    dispatch(fetchBookings({ page: 1, pageSize: 10 }, userId))
      .catch(err => message.error(err.message));
  },
  onWillUnmount: () => {
    dispatch(removeFilter('bookings', 'longitude'));
    dispatch(removeFilter('bookings', 'latitude'));
    dispatch(removeFilter('bookings', 'radius'));
  },
  onPaginationChange: (page, newPageSize) =>
    dispatch(fetchBookings({ page, pageSize: newPageSize }, userId))
      .catch(err => message.error(err.message)),
  onPageChange:
  (newPage, pageSize) => dispatch(fetchBookings({ page: newPage, pageSize }, userId))
    .catch(err => message.error(err.message)),
  onFilterChange: (key, val) => {
    if (val == null) {
      dispatch(removeFilter('bookings', key));
    } else {
      dispatch(setFilter('bookings', key, val));
    }
  },
  onEdit: id => history.push(ROUTE_EDIT_APARTMENT.replace(':apartmentId', id)),
  onFilter: () => dispatch(fetchBookings({ page: 1, pageSize: 10 }, userId))
    .catch(err => message.error(err.message)),
  onUnBook: (apartmentId) => {
    dispatch(sendDeleteBooking(apartmentId, userId)).then(() => {
      message.success('Succesfully unbooked an apartment!');
      dispatch(fetchBookings({ page: 1, pageSize: 10 }, userId))
        .catch(err => message.error(err.message));
    }).catch(err => message.error(err.message));
  },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Apartments));
