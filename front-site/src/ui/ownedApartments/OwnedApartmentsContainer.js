import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Apartments from 'ui/apartments/list/Apartments';
import { fetchOwnedApartments } from 'state/apartments/actions';
import { getOwnedApartments } from 'state/apartments/selectors';
import { getPagination } from 'state/pagination/selectors';
import { getLoading } from 'state/loading/selectors';
import { getAuthInfo } from 'state/auth/selectors';
import { ROUTE_EDIT_APARTMENT } from 'app-init/router';
import { removeFilter, setFilter } from 'state/filters/actions';
import { getFilters } from 'state/filters/selectors';

const mapStateToProps = state => ({
  apartments: getOwnedApartments(state),
  pagination: getPagination(state),
  loading: getLoading(state).ownedApartments,
  auth: getAuthInfo(state),
  filters: getFilters(state, 'ownedApartments'),
});

const mapDispatchToProps = (dispatch, { history }) => ({
  onDidMount: () => {
    dispatch(fetchOwnedApartments());
  },
  onPaginationChange: (page, newPageSize) =>
    dispatch(fetchOwnedApartments({ page, pageSize: newPageSize })),
  onPageChange: (newPage, pageSize) => dispatch(fetchOwnedApartments({ page: newPage, pageSize })),
  onEdit: id => history.push(ROUTE_EDIT_APARTMENT.replace(':apartmentId', id)),
  onFilterChange: (key, val) => {
    if (!val) {
      dispatch(removeFilter('ownedApartments', key));
    } else {
      dispatch(setFilter('ownedApartments', key, val));
    }
  },
  onFilter: () => dispatch(fetchOwnedApartments()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Apartments));
