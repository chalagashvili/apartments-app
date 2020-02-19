import React from 'react';
import { Typography } from 'antd';
import { FormattedMessage } from 'react-intl';
import InternalPage from 'ui/InternalPage';
import EditUserContainer from 'ui/users/edit/EditUserContainer';

const { Title } = Typography;

const LoginPage = () => (
  <InternalPage>
    <Title level={3} style={{ marginTop: 30 }} className="LoginPage__title">
      <FormattedMessage id="app.editUser" />
    </Title>
    <EditUserContainer />
  </InternalPage>
);

export default LoginPage;
