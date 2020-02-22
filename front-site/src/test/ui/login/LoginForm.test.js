import React from 'react';
import 'test/enzyme-init';
import { shallow } from 'enzyme';
import { LoginFormBody } from 'ui/login/LoginForm';

const handleSubmit = jest.fn();
const onSubmit = jest.fn();
const onWillMount = jest.fn();

describe('LoginForm', () => {
  let loginForm;
  let submitting;
  let invalid;
  let profileTypes;

  beforeEach(() => {
    submitting = false;
    invalid = false;
  });
  const buildLoginForm = (mode) => {
    const props = {
      profileTypes,
      submitting,
      invalid,
      handleSubmit,
      onWillMount,
      onSubmit,
      mode,
      form: {
        validateFields: jest.fn(),
        getFieldDecorator: jest.fn(() => jest.fn()),
        setFields: jest.fn(),
        getFieldValue: jest.fn(),
        getFieldsError: () => jest.fn(),
        isFieldTouched: jest.fn(),
        getFieldError: jest.fn(),
      },
      intl: {
        formatMessage: jest.fn(),
      },
    };

    return shallow(<LoginFormBody {...props} />);
  };

  it('root component renders without crashing', () => {
    loginForm = buildLoginForm();
    expect(loginForm.exists()).toBe(true);
  });
});
