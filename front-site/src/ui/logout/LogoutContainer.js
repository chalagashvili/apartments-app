import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Logout from 'ui/logout/Logout';
import { removeCookie } from 'utils';
import { clearAuth, logout } from 'state/auth/actions';
import { ROUTE_HOME } from 'app-init/router';

const mapDispatchToProps = (dispatch, { history }) => ({
  onLogout: () => {
    removeCookie('jwtToken');
    removeCookie('role');
    removeCookie('email');
    removeCookie('id');
    dispatch(logout());
    dispatch(clearAuth());
    history.push(ROUTE_HOME);
  },
});

export default withRouter(connect(null, mapDispatchToProps)(Logout));
