import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { message } from 'antd';

import ResetPasswordForm from 'ui/resetPassword/ResetPasswordForm';
import { getLoading } from 'state/loading/selectors';
import { ROUTE_HOME } from 'app-init/router';
import { sendPostResetPassword } from 'state/auth/actions';

const mapStateToProps = state => ({
  loading: getLoading(state).resetPassword,
});

const mapDispatchToProps = (dispatch, { history }) => ({
  onSubmit: (values, token) => {
    dispatch(sendPostResetPassword(values, token)).then(() => {
      message.success('Your password has been succesfully set!');
      history.push(ROUTE_HOME);
    }).catch(err => message.error(err));
  },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResetPasswordForm));
