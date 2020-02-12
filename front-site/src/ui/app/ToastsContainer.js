import { connect } from 'react-redux';
import Toasts from 'ui/app/Toasts';
import { getError } from 'state/error/selectors';

const mapStateToProps = state => ({
  error: getError(state),
});

export default connect(mapStateToProps)(Toasts);
