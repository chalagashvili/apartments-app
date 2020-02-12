import { connect } from 'react-redux';
import SignupForm from 'ui/signup/SignupForm';
import { sendPostSignup } from 'state/auth/actions';

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
  onSubmit: values => dispatch(sendPostSignup(values)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignupForm);
