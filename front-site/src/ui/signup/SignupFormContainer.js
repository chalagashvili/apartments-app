import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import SignupForm from 'ui/signup/SignupForm';
import { sendPostSignup } from 'state/auth/actions';
import { message } from 'antd';
import { getLoading } from 'state/loading/selectors';
import { generateDashboardRoute } from 'utils/';

const mapStateToProps = state => ({
  loading: getLoading(state).signup,
});

const mapDispatchToProps = (dispatch, { intl, history }) => ({
  onSubmit: values => dispatch(sendPostSignup(values))
    .then((payload) => {
      message.success(intl.formatMessage({ id: 'app.signupSuccess' }));
      history.push(generateDashboardRoute(payload.role));
    })
    .catch(err => message.error(err.message)),
});

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(SignupForm)));
