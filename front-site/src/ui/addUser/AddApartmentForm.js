import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Icon, Input, Button } from 'antd';
import { emailRegexPattern } from 'utils/const';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class AddApartmentForm extends React.Component {
  // componentDidMount() {
  //   // To disable submit button at the beginning.
  //   this.props.form.validateFields();
  // }

  render() {
    const { intl, form } = this.props;
    const {
      getFieldDecorator, getFieldsError,
      isFieldTouched, getFieldError,
    } = form;

    return (
      <div className="">
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item >
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
            // disabled={hasErrors(getFieldsError())}
            >
              <FormattedMessage id="app.submit" />
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create({ name: 'add_apartment' })(injectIntl(AddApartmentForm));

