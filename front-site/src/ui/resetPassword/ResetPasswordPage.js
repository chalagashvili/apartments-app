import React from 'react';
import { Typography } from 'antd';
import { FormattedMessage } from 'react-intl';
import InternalPage from 'ui/InternalPage';
import ResetPasswordFormContainer from './ResetPasswordFormContainer';

const { Title } = Typography;

const ResetPasswordPage = () => (
  <InternalPage>
    <Title className="LoginPage__welcome">
      <FormattedMessage id="app.resetPassword" />
    </Title>
    <ResetPasswordFormContainer />
  </InternalPage>
);

export default ResetPasswordPage;
