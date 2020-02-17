import React from 'react';
import { Typography } from 'antd';
import { FormattedMessage } from 'react-intl';
import InternalPage from 'ui/InternalPage';
import UsersFormContainer from './UsersFormContainer';

const { Title } = Typography;

const UsersPage = () => (
  <InternalPage>
    <Title className="LoginPage__welcome">
      <FormattedMessage id="app.users" />
    </Title>
    <UsersFormContainer />
  </InternalPage>
);

export default UsersPage;
