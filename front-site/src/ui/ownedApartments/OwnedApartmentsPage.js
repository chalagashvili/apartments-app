import React from 'react';
import InternalPage from 'ui/InternalPage';
import OwnedApartmentsContainer from 'ui/ownedApartments/OwnedApartmentsContainer';

const OwnedApartmentsPage = () => (
  <InternalPage footerDisabled>
    <OwnedApartmentsContainer />
  </InternalPage>
);

export default OwnedApartmentsPage;
