import React from 'react';
import InternalPage from 'ui/InternalPage';
import AvailableApartmentsContainer from 'ui/availableApartments/AvailableApartmentsContainer';

const AvailableApartmentsPage = () => (
  <InternalPage footerDisabled>
    <AvailableApartmentsContainer />
  </InternalPage>
);

export default AvailableApartmentsPage;
