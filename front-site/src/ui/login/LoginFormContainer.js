import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { message } from 'antd';

import LoginForm from 'ui/login/LoginForm';
import { sendPostLogin } from 'state/auth/actions';
import { getLoading } from 'state/loading/selectors';
import { generateDashboardRoute } from 'utils/';

export const mapStateToProps = state => ({
  loading: getLoading(state).login,
});

export const mapDispatchToProps = (dispatch, { history, intl }) => ({
  onSubmit: values => dispatch(sendPostLogin(values))
    .then((payload) => {
      message.success(intl.formatMessage({ id: 'app.loginSuccess' }));
      history.push(generateDashboardRoute(payload.role));
    })
    .catch(err => message.error(err.message)),
});

export default withRouter(injectIntl(connect(mapStateToProps, mapDispatchToProps)(LoginForm)));
