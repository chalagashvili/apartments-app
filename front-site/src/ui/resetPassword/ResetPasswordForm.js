import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Icon, Input, Button } from 'antd';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class ResetPasswordForm extends React.Component {
  componentDidMount() {
    // To disable submit button at the beginning.
    this.props.form.validateFields();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { match: { params = {} } } = this.props;
        this.props.onSubmit(values, params.resetToken);
      }
    });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form, intl } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(intl.formatMessage({ id: 'app.passwordsDontMatch' }));
    } else {
      callback();
    }
  }

  render() {
    const { intl, form, loading } = this.props;
    const {
      getFieldDecorator, getFieldsError,
      isFieldTouched, getFieldError,
    } = form;

    // Only show error after a field is touched.
    const passwordError = isFieldTouched('password') && getFieldError('password') && intl.formatMessage({ id: getFieldError('password') });
    const confirmPasswordError = isFieldTouched('confirmPassword') && getFieldError('confirmPassword') && intl.formatMessage({ id: getFieldError('confirmPassword') });

    return (
      <div className="LoginFormWrapper">
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item
            validateStatus={passwordError ? 'error' : ''}
            help={passwordError || ''}
          >
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'app.inputPassword' }, {
                min: 8, message: 'app.minPassword',
              }],
            })(<Input
              placeholder={intl.formatMessage({ id: 'app.password' })}
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
            />)}
          </Form.Item>
          <Form.Item
            validateStatus={confirmPasswordError ? 'error' : ''}
            help={confirmPasswordError || ''}
          >
            {getFieldDecorator('confirmPassword', {
              rules: [{ required: true, message: 'app.provideConfirmPassword' }, {
                validator: this.compareToFirstPassword,
              }],
            })(<Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder={intl.formatMessage({ id: 'app.confirmPassword' })}
              type="password"
            />)}
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              loading={loading}
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

ResetPasswordForm.propTypes = {
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
  loading: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({}),
  }),
};

ResetPasswordForm.defaultProps = {
  loading: false,
  match: {
    params: {},
  },
};

export default Form.create({ name: 'normal_login' })(injectIntl(ResetPasswordForm));
