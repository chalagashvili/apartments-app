import { createBrowserHistory } from 'history';

export const history = createBrowserHistory({
  basename: process.env.PUBLIC_URL,
});

// public
export const ROUTE_HOME = '/';
// pre-auth
export const ROUTE_SIGN_UP = '/sign-up';
export const ROUTE_FORGOT_PASSWORD = '/forgot-password';
export const ROUTE_RESET_PASSWORD = '/resetPassword/:resetToken';
export const ROUTE_APARTMENTS = '/apartments';
// auth needed
export const ROUTE_PROFILE = '/profile';
export const ROUTE_BOOKINGS = '/bookings';

// realtor
export const ROUTE_ADD_APARTMENT = '/apartments/add';
export const ROUTE_EDIT_APARTMENT = '/apartments/edit/:apartmentId';
export const ROUTE_OWNED_APARTMENTS = '/ownedApartments';

// admin
export const ROUTE_USERS = '/users';
export const ROUTE_ADD_USER = '/users/add';
export const ROUTE_EDIT_USER = '/users/edit/:userId';
// admin for realtor
export const ROUTE_ADMIN_OWNED_APARTMENTS = '/:userId/ownedApartments';
export const ROUTE_ADMIN_EDIT_APARTMENT = '/:userId/apartments/edit/:apartmentId';
export const ROUTE_ADMIN_ADD_APARTMENT = '/:userId/apartments/add/';
// admin for client
export const ROUTE_ADMIN_BOOKINGS = '/:userId/bookings';
// logout
export const ROUTE_LOGOUT = '/logout';
