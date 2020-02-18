import React from 'react';
import { Typography } from 'antd';
import { FormattedMessage } from 'react-intl';
import InternalPage from 'ui/InternalPage';
import AddApartmentContainer from 'ui/apartments/add/AddApartmentFormContainer';

const { Title } = Typography;

const AddApartmentPage = () => (
  <InternalPage className="AddApartmentPage">
    <Title level={3} className="AddApartmentPage__title">
      <FormattedMessage id="menu.addApartment" />
    </Title>
    <AddApartmentContainer />
  </InternalPage>
);

export default AddApartmentPage;
