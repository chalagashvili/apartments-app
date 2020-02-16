import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { history, ROUTE_HOME } from 'app-init/router';
import { getAuthInfo } from 'state/auth/selectors';


export default function (ComposedComponent) {
  class Auth extends React.Component {
    constructor(props) {
      super(props);
      this.performCheck = this.performCheck.bind(this);
    }

    componentDidMount() {
      // this.performCheck();
    }

    componentDidUpdate() {
      // this.performCheck();
    }

    performCheck() {
      const { auth } = this.props;
      if (!auth.authenticated) history.push(ROUTE_HOME);
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  Auth.propTypes = {
    auth: PropTypes.shape({
      authenticated: PropTypes.bool,
      email: PropTypes.string,
    }),
    children: PropTypes.arrayOf(),
  };

  Auth.defaultProps = {
    auth: {
      authenticated: false,
      email: '',
    },
    children: null,
  };

  const mapStateToProps = state => ({
    auth: getAuthInfo(state),
  });

  return connect(mapStateToProps, null, null, {
    pure: false,
  })(Auth);
}
