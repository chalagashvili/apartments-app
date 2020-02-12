import React from 'react';
import { Typography } from 'antd';
import { FormattedMessage } from 'react-intl';
import InternalPage from 'ui/InternalPage';
import LoginFormContainer from 'ui/login/LoginFormContainer';

const { Title } = Typography;

const LoginPage = () => (
  <InternalPage>
    <Title className="LoginPage__welcome">
      <FormattedMessage id="app.welcome" />
    </Title>
    <Title level={4} className="LoginPage__prelude">
      <FormattedMessage id="app.prelude" />
    </Title>
    <Title level={3} className="LoginPage__title">
      <FormattedMessage id="app.login" />
    </Title>
    <LoginFormContainer />
  </InternalPage>
);

export default LoginPage;
