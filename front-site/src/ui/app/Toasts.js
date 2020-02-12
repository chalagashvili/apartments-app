import React from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';

const Toasts = ({ error }) => (
  <React.Fragment>
    { error && message.error(error)}
  </React.Fragment>
)

Toasts.propTypes = {
  error: PropTypes.string,
};

Toasts.defaultProps = {
  error: null,
};

export default Toasts;