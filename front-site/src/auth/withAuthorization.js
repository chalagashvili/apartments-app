import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { history, ROUTE_HOME } from 'app-init/router';
import { getAuthInfo } from 'state/auth/selectors';
/**
 * HOC that Handles whether or not the user is allowed to see the page.
 * @param {array} allowedRoles - user roles that are allowed to see the page.
 * @returns {Component}
 */
export default function Authorization(allowedRoles) {
  return (WrappedComponent) => {
    class WithAuthorization extends Component {
      constructor(props) {
        super(props);
        this.performCheck = this.performCheck.bind(this);
      }

      componentDidMount() {
        this.performCheck();
      }

      componentDidUpdate() {
        this.performCheck();
      }

      performCheck() {
        const { auth } = this.props;
        const { role } = auth;
        if (!allowedRoles.includes(role)) history.push(ROUTE_HOME);
      }

      render() {
        const { auth = {} } = this.props;
        const { role } = auth;
        if (allowedRoles.includes(role)) {
          return <WrappedComponent {...this.props} />;
        }
        return <h1>You are not allowed to browse this!</h1>;
      }
    }

    WithAuthorization.propTypes = {
      auth: PropTypes.shape({
        role: PropTypes.string,
      }),
    };

    WithAuthorization.defaultProps = {
      auth: {
        role: 'user',
      },
    };

    const mapStateToProps = state => ({
      auth: getAuthInfo(state),
    });


    return connect(mapStateToProps)(WithAuthorization);
  };
}
