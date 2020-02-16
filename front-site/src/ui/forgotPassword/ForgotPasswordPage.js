import React from 'react';
import { Typography } from 'antd';
import { FormattedMessage } from 'react-intl';
import InternalPage from 'ui/InternalPage';
import ForgotPasswordFormContainer from './ForgotPasswordFormContainer';

const { Title } = Typography;

const ForgotPasswordPage = () => (
  <InternalPage>
    <Title className="LoginPage__welcome">
      <FormattedMessage id="app.forgotPassword" />
    </Title>
    <Title level={4} className="LoginPage__prelude">
      <FormattedMessage id="app.forgotPasswordTitle" />
    </Title>
    <ForgotPasswordFormContainer />
  </InternalPage>
);

export default ForgotPasswordPage;
