import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { history, ROUTE_HOME, ROUTE_BOOKINGS, ROUTE_OWNED_APARTMENTS } from 'app-init/router';
import { getAuthInfo } from 'state/auth/selectors';
import { AdminOnly, clientRole, realtorRole } from 'utils/const';
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
        const { auth, match: { path, params: { userId } } } = this.props;
        const { role } = auth;
        if (!allowedRoles.includes(role)) return history.push(ROUTE_HOME);
        // Check if admin is browsing through clients routes but without userId set
        if (allowedRoles === clientRole && role === AdminOnly
          && userId == null && path === ROUTE_BOOKINGS) {
          return history.push(ROUTE_HOME);
        }
        // Check if admin is browsing through realtors routes but without userId set
        if (allowedRoles === realtorRole && role === AdminOnly
          && userId == null && path === ROUTE_OWNED_APARTMENTS) {
          return history.push(ROUTE_HOME);
        }
        return 1;
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
      match: PropTypes.shape({
        params: PropTypes.shape({
          userId: PropTypes.string,
        }),
        path: PropTypes.string.isRequired,
      }),

    };

    WithAuthorization.defaultProps = {
      auth: {
        role: '',
      },
      match: {
        params: {},
      },
    };

    const mapStateToProps = state => ({
      auth: getAuthInfo(state),
    });


    return connect(mapStateToProps)(WithAuthorization);
  };
}
