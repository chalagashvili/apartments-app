import React from 'react';
import { Typography } from 'antd';
import { FormattedMessage } from 'react-intl';
import InternalPage from 'ui/InternalPage';
import SignupFormContainer from 'ui/signup/SignupFormContainer';

const { Title } = Typography;

const SignupPage = () => (
  <InternalPage className="SignupPage">
    <Title level={3} className="SignupPage__title">
      <FormattedMessage id="signup.title" />
    </Title>
    <SignupFormContainer />
  </InternalPage>
);

export default SignupPage;
