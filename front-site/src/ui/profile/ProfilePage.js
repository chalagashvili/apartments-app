import React from 'react';
import { Typography } from 'antd';
import { FormattedMessage } from 'react-intl';
import InternalPage from 'ui/InternalPage';
import EditProfileFormContainer from 'ui/profile/EditProfileFormContainer';

const { Title } = Typography;

const EditProfilePage = () => (
  <InternalPage className="AddApartmentPage" footerDisabled>
    <Title level={3} className="AddApartmentPage__title">
      <FormattedMessage id="app.editProfile" />
    </Title>
    <EditProfileFormContainer />
  </InternalPage>
);

export default EditProfilePage;
