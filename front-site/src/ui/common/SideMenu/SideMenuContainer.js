import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import SideMenu from 'ui/common/SideMenu/SideMenu';
import { getAuthInfo } from 'state/auth/selectors';

const mapStateToProps = (state, { history }) => ({
  auth: getAuthInfo(state),
  currentRoute: history.location.pathname,
});

export default withRouter(connect(mapStateToProps)(SideMenu));

