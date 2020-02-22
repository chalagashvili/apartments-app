import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Icon, Input, Button, Select, Spin } from 'antd';
import { emailRegexPattern, AdminOnly } from 'utils/const';

const { Option } = Select;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class UserForm extends React.Component {
  componentDidMount() {
    const { onDidMount, form, match: { params } } = this.props;
    onDidMount(params.userId, form);
    // To disable submit button at the beginning.
    form.validateFields();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { form, match: { params } } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values, params.userId);
      }
    });
  };

  render() {
    const {
      intl, form, loading, onCancel, auth: { role },
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

    const selectComponent = (
      <Select style={{ width: '100%' }}>
        <Option value="client"><FormattedMessage id="app.client" /></Option>
        <Option value="realtor"><FormattedMessage id="app.realtor" /></Option>
        {
          role && AdminOnly ? <Option value="admin"><FormattedMessage id="app.admin" /></Option> : null
        }
      </Select>);

    // Only show error after a field is touched.
    const emailError = isFieldTouched('email') && getFieldError('email') && intl.formatMessage({ id: getFieldError('email') });
    const roleError = isFieldTouched('role') && getFieldError('role') && intl.formatMessage({ id: getFieldError('role') });

    return (
      <Spin spinning={loading}>
        <div className="SignupFormWrapper">
          <Form {...formItemLayout} onSubmit={this.handleSubmit} className="login-form">
            <Form.Item label={intl.formatMessage({ id: 'app.email' })} validateStatus={emailError ? 'error' : ''} help={emailError || ''}>
              {getFieldDecorator('email', {
              rules: [{ required: true, message: 'app.inputEmail' },
            { pattern: emailRegexPattern, message: 'app.validEmail' }],
            })(<Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            />)}
            </Form.Item>
            <Form.Item label={intl.formatMessage({ id: 'app.role' })} validateStatus={roleError ? 'error' : ''} help={roleError || ''}>
              {
              getFieldDecorator('role', {
                  rules: [
                    { required: true, message: 'app.provideRole' },
                  ],
                })(selectComponent)
              }
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

UserForm.propTypes = {
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
  user: PropTypes.shape({}),
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string,
    }),
  }),
  onDidMount: PropTypes.func,
  auth: PropTypes.shape({
    role: PropTypes.string,
  }),
};

UserForm.defaultProps = {
  loading: false,
  user: {},
  onDidMount: () => {},
  match: {
    params: {},
  },
  auth: {
    role: '',
  },
};

export default Form.create({ name: 'admin_user_edit' })(injectIntl(UserForm));
