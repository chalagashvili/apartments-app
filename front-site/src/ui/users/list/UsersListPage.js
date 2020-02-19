import React from 'react';
import { Typography } from 'antd';
import { FormattedMessage } from 'react-intl';
import InternalPage from 'ui/InternalPage';
import UsersListTableContainer from 'ui/users/list/UsersListTableContainer';

const { Title } = Typography;

const UsersListPage = () => (
  <InternalPage footerDisabled>
    <Title className="LoginPage__welcome">
      <FormattedMessage id="app.users" />
    </Title>
    <UsersListTableContainer />
  </InternalPage>
);

export default UsersListPage;
