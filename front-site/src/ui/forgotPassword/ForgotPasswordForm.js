import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Icon, Input, Button } from 'antd';
import { emailRegexPattern } from 'utils/const';

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
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    const { intl, form } = this.props;
    const {
      getFieldDecorator, getFieldsError,
      isFieldTouched, getFieldError,
    } = form;
    // Only show error after a field is touched.
    const emailError = isFieldTouched('email') && getFieldError('email') && intl.formatMessage({ id: getFieldError('email') });
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
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              disabled={hasErrors(getFieldsError())}
            >
              <FormattedMessage id="app.submit" />
            </Button>
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
};

export default Form.create({ name: 'normal_login' })(injectIntl(LoginForm));
