import { ROUTE_DASHBOARD,
  ROUTE_PROFILE,
  ROUTE_MY_RENTED_APARTMENTS_AS_CLIENT,
  ROUTE_ADD_APARTMENT,
  ROUTE_APARTMENTS_I_RENT_AS_REALTOR,
  ROUTE_ADD_USER,
  ROUTE_USERS,
  ROUTE_LOGOUT } from 'app-init/router';

export const lastRoutes = [
  {
    id: 'profile',
    path: ROUTE_PROFILE,
    icon: 'setting',
  },
  {
    id: 'logout',
    path: ROUTE_LOGOUT,
    icon: 'logout',
  },
];

export const clientOnlyRoutes = [
  {
    id: 'dashboard',
    path: ROUTE_DASHBOARD,
    icon: 'dashboard',
  },
  {
    id: 'myRentedApartments',
    path: ROUTE_MY_RENTED_APARTMENTS_AS_CLIENT,
    icon: 'carry-out',
  },
];

export const clientRoutes = [
  ...clientOnlyRoutes,
  ...lastRoutes,
];

export const realtorOnlyRoutes = [
  ...clientOnlyRoutes,
  {
    id: 'addNewApartment',
    path: ROUTE_ADD_APARTMENT,
    icon: 'plus-square',
  },
  {
    id: 'apartmentsIRent',
    path: ROUTE_APARTMENTS_I_RENT_AS_REALTOR,
    icon: 'solution',
  },
];

export const realtorRoutes = [
  ...clientOnlyRoutes,
  ...lastRoutes,
];

export const adminRoutes = [
  ...clientOnlyRoutes,
  ...realtorOnlyRoutes,
  {
    id: 'users',
    path: ROUTE_USERS,
    icon: 'team',
  },
  {
    id: 'addUser',
    path: ROUTE_ADD_USER,
    icon: 'user-add',
  },
  ...lastRoutes,
];

export const allRoles = ['client', 'realtor', 'admin'];
export const clientRole = ['client', 'realtor', 'admin'];
export const realtorRole = ['realtor', 'admin'];
export const adminRole = ['admin'];

// eslint-disable-next-line no-useless-escape
export const emailRegexPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
