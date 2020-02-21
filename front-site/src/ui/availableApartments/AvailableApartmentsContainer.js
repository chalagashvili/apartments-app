import { connect } from 'react-redux';
import { message } from 'antd';
import { withRouter } from 'react-router-dom';
import Apartments from 'ui/apartments/list/Apartments';
import { fetchAvailableApartments } from 'state/apartments/actions';
import { getAvailableApartments } from 'state/apartments/selectors';
import { getPagination } from 'state/pagination/selectors';
import { getLoading } from 'state/loading/selectors';
import { getAuthInfo } from 'state/auth/selectors';
import { removeFilter, setFilter } from 'state/filters/actions';
import { getFilters } from 'state/filters/selectors';
import { sendPostBooking } from 'state/users/actions';
import { ClientOnly } from 'utils/const';

const mapStateToProps = state => ({
  apartments: getAvailableApartments(state),
  pagination: getPagination(state),
  loading: getLoading(state).availableApartments,
  groupLoading: getLoading(state).book,
  auth: getAuthInfo(state),
  filters: getFilters(state, 'availableApartments'),
  mode: ClientOnly,
});

const mapDispatchToProps = dispatch => ({
  onDidMount: () => {
    dispatch(fetchAvailableApartments()).catch(err => message.error(err));
  },
  onWillUnmount: () => {
    dispatch(removeFilter('availableApartments', 'longitude'));
    dispatch(removeFilter('availableApartments', 'latitude'));
    dispatch(removeFilter('availableApartments', 'radius'));
  },
  onPaginationChange: (page, newPageSize) =>
    dispatch(fetchAvailableApartments({ page, pageSize: newPageSize })),
  onPageChange:
  (newPage, pageSize) => dispatch(fetchAvailableApartments({ page: newPage, pageSize }))
    .catch(err => message.error(err)),
  onFilterChange: (key, val) => {
    if (val == null) {
      dispatch(removeFilter('availableApartments', key));
    } else {
      dispatch(setFilter('availableApartments', key, val));
    }
  },
  onFilter: () => dispatch(fetchAvailableApartments()).catch(err => message.error(err)),
  onBook: (apartmentId) => {
    dispatch(sendPostBooking(apartmentId)).then(() => {
      message.success('Succesfully booked an apartment! Go to bookings to check it out');
      dispatch(fetchAvailableApartments()).catch(err => message.error(err));
    }).catch(err => message.error(err));
  },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Apartments));
