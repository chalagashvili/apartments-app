import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Icon, Input, Button, Spin } from 'antd';
import { emailRegexPattern } from 'utils/const';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class EditProfileForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
    };
    this.compareToFirstPassword = this.compareToFirstPassword.bind(this);
    this.validateToNextPassword = this.validateToNextPassword.bind(this);
    this.handleConfirmBlur = this.handleConfirmBlur.bind(this);
  }


  componentDidMount() {
    const { onDidMount, form } = this.props;
    onDidMount(form);
    // To disable submit button at the beginning.
    form.validateFields();
  }

  handleConfirmBlur(e) {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword(rule, value, callback) {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('app.passwordsDontMatch');
    } else {
      callback();
    }
  }

  validateToNextPassword(rule, value, callback) {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirmPassword'], { force: true });
    }
    callback();
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
    const {
      intl, form, loading, onCancel,
    } = this.props;
    const {
      getFieldDecorator, getFieldsError,
      isFieldTouched, getFieldError,
    } = form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    // Only show error after a field is touched.
    const emailError = isFieldTouched('email') && getFieldError('email') && intl.formatMessage({ id: getFieldError('email') });
    const passwordError = isFieldTouched('password') && getFieldError('password') && intl.formatMessage({ id: getFieldError('password') });
    const confirmPasswordError = isFieldTouched('confirmPassword') && getFieldError('confirmPassword') && intl.formatMessage({ id: getFieldError('confirmPassword') });
    return (
      <Spin spinning={loading}>
        <div className="SignupFormWrapper">
          <Form {...formItemLayout} onSubmit={this.handleSubmit} className="login-form">
            <Form.Item label={intl.formatMessage({ id: 'app.email' })} validateStatus={emailError ? 'error' : ''} help={emailError || ''}>
              {getFieldDecorator('email', {
              rules: [
            { pattern: emailRegexPattern, message: 'app.validEmail' }],
            })(<Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            />)}
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({ id: 'app.password' })}
              validateStatus={passwordError ? 'error' : ''}
              help={passwordError || ''}
            >
              {getFieldDecorator('password', {
              rules: [
                { min: 8, message: 'app.minPassword' },
                { validator: this.validateToNextPassword },
              ],
            })(<Input.Password
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            />)}
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({ id: 'app.confirmPassword' })}
              validateStatus={confirmPasswordError || form.getFieldValue('password') !== form.getFieldValue('confirmPassword') ? 'error' : ''}
              help={confirmPasswordError || ''}
            >
              {getFieldDecorator('confirmPassword', {
              rules: [
                { validator: this.compareToFirstPassword }],
            })(<Input.Password
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              onBlur={this.handleConfirmBlur}
            />)}
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({ id: 'app.fullname' })}
            >
              {getFieldDecorator('name', {
            rules: [{ required: false, whitespace: false }],
          })(<Input type="name" />)}
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="login-form-button"
                disabled={hasErrors(getFieldsError())}
              >
                <FormattedMessage id="app.save" />
              </Button>
              <Button
                onClick={onCancel}
                style={{ marginLeft: 10 }}
              >
                <FormattedMessage id="app.cancel" />
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Spin>
    );
  }
}

EditProfileForm.propTypes = {
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
  onCancel: PropTypes.func.isRequired,
  onDidMount: PropTypes.func.isRequired,
};

EditProfileForm.defaultProps = {
  loading: false,
};

export default Form.create({ name: 'editProfile' })(injectIntl(EditProfileForm));
