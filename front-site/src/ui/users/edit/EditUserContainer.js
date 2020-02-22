import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { message } from 'antd';

import UserForm from 'ui/users/common/UserForm';
import { getLoading } from 'state/loading/selectors';
import { ROUTE_USERS } from 'app-init/router';
import { sendPutUser, fetchUser } from 'state/users/actions';
import { getUser } from 'state/users/selectors';
import { getAuthInfo } from 'state/auth/selectors';

const mapStateToProps = state => ({
  loading: getLoading(state).editProfile,
  user: getUser(state),
  auth: getAuthInfo(state),
});

const mapDispatchToProps = (dispatch, { history }) => ({
  onDidMount: (userId, form) => dispatch(fetchUser(userId, form))
    .catch(err => message.error(err.message)),
  onSubmit: (values, userId) => dispatch(sendPutUser(values, userId))
    .then(() => {
      message.success('User has been successfully updated');
      history.push(ROUTE_USERS);
    })
    .catch(err => message.error(err.message)),
  onCancel: () => history.goBack(),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserForm));
