import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import SignupForm from 'ui/signup/SignupForm';
import { sendPostSignup } from 'state/auth/actions';
import { ROUTE_DASHBOARD } from 'app-init/router';
import { message } from 'antd';
import { getLoading } from 'state/loading/selectors';

const mapStateToProps = state => ({
  loading: getLoading(state).signup,
});

const mapDispatchToProps = (dispatch, { intl, history }) => ({
  onSubmit: values => dispatch(sendPostSignup(values))
    .then(() => {
      message.success(intl.formatMessage({ id: 'app.signupSuccess' }));
      history.push(ROUTE_DASHBOARD);
    })
    .catch(err => message.error(err)),
});

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(SignupForm)));
