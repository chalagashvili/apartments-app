import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { message } from 'antd';

import UsersListTable from 'ui/users/list/UsersListTable';
import { fetchUsers, sendDeleteUser } from 'state/users/actions';
import { getUsersList } from 'state/users/selectors';
import { getLoading } from 'state/loading/selectors';
import { getPagination } from 'state/pagination/selectors';
import { ROUTE_EDIT_USER, ROUTE_ADMIN_OWNED_APARTMENTS, ROUTE_ADMIN_BOOKINGS } from 'app-init/router';
import { ClientOnly, RealtorOnly } from 'utils/const';

const mapStateToProps = state => ({
  users: getUsersList(state),
  pagination: getPagination(state),
  groupLoading: getLoading(state).deleteUser,
  loading: getLoading(state).users,
});

const mapDispatchToProps = (dispatch, { history }) => ({
  onDidMount: () => {
    dispatch(fetchUsers());
  },
  onEdit: (userId) => { history.push(ROUTE_EDIT_USER.replace(':userId', userId)); },
  onDelete: (userId) => {
    dispatch(sendDeleteUser(userId))
      .then(() => { dispatch(fetchUsers()); message.success('User has succesfully deleted'); })
      .catch(err => message.error(err));
  },
  onCheck: (userId, email, role) => {
    if (role === ClientOnly) {
      history.push(ROUTE_ADMIN_BOOKINGS.replace(':userId', userId));
    } else if (role === RealtorOnly) {
      history.push(ROUTE_ADMIN_OWNED_APARTMENTS.replace(':userId', userId));
    }
  },
  onPaginationChange: (page, newPageSize) =>
    dispatch(fetchUsers({ page, pageSize: newPageSize })),
  onPageChange: (newPage, pageSize) => dispatch(fetchUsers({ page: newPage, pageSize })),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UsersListTable));
