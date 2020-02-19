import React from 'react';
import { Typography } from 'antd';
import { FormattedMessage } from 'react-intl';
import InternalPage from 'ui/InternalPage';
import AddUserContainer from 'ui/users/add/AddUserContainer';

const { Title } = Typography;

const LoginPage = () => (
  <InternalPage>
    <Title level={3} style={{ marginTop: 30 }} className="LoginPage__title">
      <FormattedMessage id="app.addUser" />
    </Title>
    <AddUserContainer />
  </InternalPage>
);

export default LoginPage;
