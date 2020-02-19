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

const mapStateToProps = state => ({
  apartments: getBookedApartments(state),
  pagination: getPagination(state),
  loading: getLoading(state).bookings,
  groupLoading: getLoading(state).book,
  auth: getAuthInfo(state),
  filters: getFilters(state, 'bookings'),
});

const mapDispatchToProps = (dispatch, { history }) => ({
  onDidMount: () => {
    dispatch(fetchBookings());
  },
  onPaginationChange: (page, newPageSize) =>
    dispatch(fetchBookings({ page, pageSize: newPageSize })),
  onPageChange:
  (newPage, pageSize) => dispatch(fetchBookings({ page: newPage, pageSize })),
  onFilterChange: (key, val) => {
    if (!val) {
      dispatch(removeFilter('bookings', key));
    } else {
      dispatch(setFilter('bookings', key, val));
    }
  },
  onEdit: id => history.push(ROUTE_EDIT_APARTMENT.replace(':apartmentId', id)),
  onFilter: () => dispatch(fetchBookings()),
  onUnBook: (apartmentId) => {
    dispatch(sendDeleteBooking(apartmentId)).then(() => {
      message.success('Succesfully unbooked an apartment! Go to apartments to book it again');
      dispatch(fetchBookings());
    }).catch(err => message.error(err));
  },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Apartments));
