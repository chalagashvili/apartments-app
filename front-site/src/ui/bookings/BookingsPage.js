import React from 'react';
import InternalPage from 'ui/InternalPage';
import BookingsContainer from 'ui/bookings/BookingsContainer';

const BookingsPage = () => (
  <InternalPage footerDisabled>
    <BookingsContainer />
  </InternalPage >
);

export default BookingsPage;
