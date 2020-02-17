import { connect } from 'react-redux';
import Apartments from 'ui/apartments/list/Apartments';
import { fetchOwnedApartments } from 'state/apartments/actions';
import { getOwnedApartments } from 'state/apartments/selectors';
import { getPagination } from 'state/pagination/selectors';
import { getLoading } from 'state/loading/selectors';

const mapStateToProps = state => ({
  apartments: getOwnedApartments(state),
  pagination: getPagination(state),
  loading: getLoading(state).apartments,
});

const mapDispatchToProps = dispatch => ({
  onDidMount: () => {
    dispatch(fetchOwnedApartments());
  },
  onPaginationChange: (page, newPageSize) =>
    dispatch(fetchOwnedApartments({ page, pageSize: newPageSize })),
  onPageChange: (newPage, pageSize) => dispatch(fetchOwnedApartments({ page: newPage, pageSize })),
});

export default connect(mapStateToProps, mapDispatchToProps)(Apartments);
