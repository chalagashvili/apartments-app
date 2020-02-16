import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ResetPasswordForm from './ResetPasswordForm';

const mapStateToProps = state => ({});

const mapDispatchToProps = state => ({
  onSubmit: values => console.log(values),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResetPasswordForm));
