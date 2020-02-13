import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Logout extends Component {
  componentDidMount() {
    const { onLogout } = this.props;
    onLogout();
  }

  render() {
    return (
      <React.Fragment></React.Fragment>
    );
  }
}

Logout.propTypes = {
  onLogout: PropTypes.func.isRequired,
};
