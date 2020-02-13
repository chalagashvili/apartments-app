import { createBrowserHistory } from 'history';

export const history = createBrowserHistory({
  basename: process.env.PUBLIC_URL,
});

// public
export const ROUTE_HOME = '/';
// pre-auth
export const ROUTE_SIGN_UP = '/sign-up';
export const ROUTE_FORGOT_PASSWORD_GENERATOR = '/forgot-password';
export const RESET_PASSWORD = '/reset-password/:resetToken';
// auth needed
export const ROUTE_DASHBOARD = '/dashboard';
export const ROUTE_PROFILE = '/profile';
export const ROUTE_MY_RENTED_APARTMENTS_AS_CLIENT = '/my-rented-apartments';

// realtor
export const ROUTE_ADD_APARTMENT = '/apartments/add';
export const ROUTE_EDIT_APARTMENT = '/apartments/edit/:apartmentCode';
export const ROUTE_APARTMENTS_I_RENT_AS_REALTOR = '/apartments-i-rent';

// admin
export const ROUTE_USERS = '/users';
export const ROUTE_ADD_USER = '/users/add';
export const ROUTE_EDIT_USER = '/users/edit/:userId';
// logout
export const ROUTE_LOGOUT = '/logout';
