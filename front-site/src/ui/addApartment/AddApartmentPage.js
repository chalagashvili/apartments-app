import React from 'react';
import { Typography } from 'antd';
import { FormattedMessage } from 'react-intl';
import InternalPage from 'ui/InternalPage';
import AddApartmentContainer from 'ui/addApartment/AddApartmentFormContainer';

const { Title } = Typography;

const AddApartmentPage = () => (
  <InternalPage>
    <Title level={3} className="LoginPage__title">
      <FormattedMessage id="app.login" />
    </Title>
    <AddApartmentContainer />
  </InternalPage>
);

export default AddApartmentPage;
