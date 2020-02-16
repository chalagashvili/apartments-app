import React from 'react';
import { Typography } from 'antd';
import { FormattedMessage } from 'react-intl';
import InternalPage from 'ui/InternalPage';
import RentedApartmentsFormContainer from './RentedApartmentsFormContainer';

const { Title } = Typography;

const RentedApartmentsPage = () => (
  <InternalPage footerDisabled>
    <RentedApartmentsFormContainer />
  </InternalPage >
);

export default RentedApartmentsPage;
