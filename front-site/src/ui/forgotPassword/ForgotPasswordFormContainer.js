import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ForgotPasswordForm from 'ui/forgotPassword/ForgotPasswordForm';
import { getLoading } from 'state/loading/selectors';

const mapStateToProps = state => ({
  loading: getLoading(state).forgotPassword,
});

const mapDispatchToProps = dispatch => ({
  onSubmit: values => console.log(values),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordForm));
