import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Menu from 'ui/menu/Menu';

const mapStateToProps = (state, { history }) => ({
  currentRoute: history.location.pathname,
});

export default withRouter(connect(mapStateToProps)(Menu));
