import {
  ROUTE_PROFILE,
  ROUTE_BOOKINGS,
  ROUTE_ADD_APARTMENT,
  ROUTE_OWNED_APARTMENTS,
  ROUTE_ADD_USER,
  ROUTE_USERS,
  ROUTE_LOGOUT,
  ROUTE_APARTMENTS,
} from 'app-init/router';

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
    id: 'apartments',
    path: ROUTE_APARTMENTS,
    icon: 'dashboard',
  },
  {
    id: 'bookings',
    path: ROUTE_BOOKINGS,
    icon: 'carry-out',
  },
];

export const clientRoutes = [
  ...clientOnlyRoutes,
  ...lastRoutes,
];

export const realtorOnlyRoutes = [
  {
    id: 'ownedApartments',
    path: ROUTE_OWNED_APARTMENTS,
    icon: 'dashboard',
  },
  {
    id: 'addApartment',
    path: ROUTE_ADD_APARTMENT,
    icon: 'plus-square',
  },
];

export const realtorRoutes = [
  ...realtorOnlyRoutes,
  ...lastRoutes,
];

export const adminRoutes = [
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

export const ClientOnly = 'client';
export const RealtorOnly = 'realtor';
export const AdminOnly = 'admin';

export const allRoles = [ClientOnly, RealtorOnly, AdminOnly];
export const clientRole = [ClientOnly, RealtorOnly, AdminOnly];
export const realtorRole = [RealtorOnly, AdminOnly];
export const adminRole = [AdminOnly];

export const nonClient = [RealtorOnly, AdminOnly];

// eslint-disable-next-line no-useless-escape
export const emailRegexPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const coordinatesRegexPatter = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;

export const defaultApartmentImage = 'https://www.welcome-hotels.com/site/assets/files/30116/welcome_hotel_marburg_superior_1k.600x600.jpg';

export const mapDefaultCenterCoordinates = {
  longitude: 44.783333,
  latitude: 41.716667,
};

export const ADD_MODE = 'work-mode-add';
export const EDIT_MODE = 'work-mode-edit';
