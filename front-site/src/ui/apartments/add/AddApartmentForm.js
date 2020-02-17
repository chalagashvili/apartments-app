import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Input, Button } from 'antd';
import { coordinatesRegexPatter } from 'utils/const';


function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class addApartmentForm extends React.Component {
  render() {
    const { intl, form, loading } = this.props;
    const {
      getFieldDecorator, getFieldsError,
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
    return (
      <div className="SignupFormWrapper">
        <Form {...formItemLayout} onSubmit={this.handleSubmit} className="login-form">
          <Form.Item
            label={intl.formatMessage({ id: 'app.fullname' })}
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, whitespace: false }],
            })(<Input type="name" />)}
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'app.size' })}
          >
            {getFieldDecorator('size', {
              rules: [{ required: true, whitespace: false }],
            })(<Input type="size" />)}
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'app.price' })}
          >
            {getFieldDecorator('price', {
              rules: [{ required: true, whitespace: false }],
            })(<Input type="price" />)}
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'app.description' })}
          >
            {getFieldDecorator('description', {
              rules: [{ required: true, whitespace: false }],
            })(<Input type="description" />)}
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'app.latitude' })}
          >
            {getFieldDecorator('coordinates', {
              rules: [{ required: true, whitespace: false },
              { pattern: coordinatesRegexPatter, message: 'app.validEmail' }],
            })(<Input type="coordinates" />)}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="login-form-button"
              disabled={hasErrors(getFieldsError())}
            >
              <FormattedMessage id="menu.addApartment" />
            </Button>
          </Form.Item>
        </Form>

      </div>
    );
  }
}

addApartmentForm.propTypes = {
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

addApartmentForm.defaultProps = {
  loading: false,
};

export default Form.create({ name: 'normal_signup' })(injectIntl(addApartmentForm));
