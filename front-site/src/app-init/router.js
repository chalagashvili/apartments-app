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
