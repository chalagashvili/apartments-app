import React from 'react';
import { Typography } from 'antd';
import { FormattedMessage } from 'react-intl';
import InternalPage from 'ui/InternalPage';
import EditApartmentContainer from 'ui/apartments/edit/EditApartmentFormContainer';

const { Title } = Typography;

const AddApartmentPage = () => (
  <InternalPage className="AddApartmentPage">
    <Title level={3} className="AddApartmentPage__title">
      <FormattedMessage id="app.editApartment" />
    </Title>
    <EditApartmentContainer />
  </InternalPage>
);

export default AddApartmentPage;
