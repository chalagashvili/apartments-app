import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Icon, Input, Button } from 'antd';
import { emailRegexPattern } from 'utils/const';
import { ROUTE_SIGN_UP } from 'app-init/router';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class LoginForm extends React.Component {
  componentDidMount() {
    // To disable submit button at the beginning.
    this.props.form.validateFields();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values);
      }
    });
  };

  render() {
    const { intl, form, loading } = this.props;
    const {
      getFieldDecorator, getFieldsError,
      isFieldTouched, getFieldError,
    } = form;
    // Only show error after a field is touched.
    const emailError = isFieldTouched('email') && getFieldError('email') && intl.formatMessage({ id: getFieldError('email') });
    const passwordError = isFieldTouched('password') && getFieldError('password') && intl.formatMessage({ id: getFieldError('password') });
    return (
      <div className="LoginFormWrapper">
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item validateStatus={emailError ? 'error' : ''} help={emailError || ''}>
            {getFieldDecorator('email', {
              rules: [{ required: true, message: 'app.inputEmail' },
            { pattern: emailRegexPattern, message: 'app.validEmail' }],
            })(<Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder={intl.formatMessage({ id: 'app.email' })}
            />)}
          </Form.Item>
          <Form.Item validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'app.inputPassword' }, {
                min: 8, message: 'app.minPassword',
              }],
            })(<Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder={intl.formatMessage({ id: 'app.password' })}
            />)}
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="login-form-button"
              disabled={hasErrors(getFieldsError())}
            >
              <FormattedMessage id="app.login" />
            </Button>
            <FormattedMessage id="app.or" /> <Link to={ROUTE_SIGN_UP}><FormattedMessage id="app.registerNow" />!</Link>
          </Form.Item>
        </Form>

      </div>
    );
  }
}

LoginForm.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  form: PropTypes.shape({
    validateFields: PropTypes.func.isRequired,
    getFieldDecorator: PropTypes.func.isRequired,
    setFields: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
    getFieldsError: PropTypes.func.isRequired,
    isFieldTouched: PropTypes.func.isRequired,
    getFieldError: PropTypes.func.isRequired,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

LoginForm.defaultProps = {
  loading: false,
};

export default Form.create({ name: 'normal_login' })(injectIntl(LoginForm));
