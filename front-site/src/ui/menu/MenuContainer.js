import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Menu from 'ui/menu/Menu';
import { getAuthInfo } from 'state/auth/selectors';

const mapStateToProps = (state, { history }) => ({
  currentRoute: history.location.pathname,
  auth: getAuthInfo(state),
});

export default withRouter(connect(mapStateToProps)(Menu));
