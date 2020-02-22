import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { message } from 'antd';

import UserForm from 'ui/users/common/UserForm';
import { getLoading } from 'state/loading/selectors';
import { ROUTE_USERS } from 'app-init/router';
import { sendPostNewUser } from 'state/users/actions';
import { getAuthInfo } from 'state/auth/selectors';

const mapStateToProps = state => ({
  loading: getLoading(state).addUser,
  auth: getAuthInfo(state),
});

const mapDispatchToProps = (dispatch, { history }) => ({
  onSubmit: values => dispatch(sendPostNewUser(values))
    .then(() => {
      message.success('New user has been successfully added');
      history.push(ROUTE_USERS);
    })
    .catch(err => message.error(err.message)),
  onCancel: () => history.goBack(),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserForm));
