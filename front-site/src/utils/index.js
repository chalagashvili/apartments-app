import Cookies from 'js-cookie';
import { ClientOnly, RealtorOnly, AdminOnly } from 'utils/const';
import { ROUTE_APARTMENTS, ROUTE_OWNED_APARTMENTS, ROUTE_USERS, ROUTE_HOME } from 'app-init/router';

export const isInteger = attribute => (
  !Number.isNaN(parseFloat(attribute)) && Number.isInteger(parseFloat(attribute))
);

export const setCookie = (key, val) => Cookies.set(key, val, {
  secure: process.env.NODE_ENV === 'production', domain: process.env.REACT_APP_PUBLIC_DOMAIN, sameSite: 'strict', expires: 1,
});

export const removeCookie = key => Cookies.remove(key);

export const generateDashboardRoute = (role) => {
  let dashboardRoute = '';
  switch (role) {
    case ClientOnly:
      dashboardRoute = ROUTE_APARTMENTS;
      break;
    case RealtorOnly:
      dashboardRoute = ROUTE_OWNED_APARTMENTS;
      break;
    case AdminOnly:
      dashboardRoute = ROUTE_USERS;
      break;
    default:
      dashboardRoute = ROUTE_HOME;
      break;
  }
  return dashboardRoute;
};

export const generateQueryParams = (filters, pagination = { page: 1, pageSize: 10 }) => {
  const allFilters = Object.assign({}, filters);
  const { page, pageSize } = pagination;
  allFilters.page = page;
  allFilters.pageSize = pageSize;
  const filterKeys = Object.keys(allFilters);
  const filterPairs = [];
  filterKeys.map(fk => filterPairs.push(`${fk}=${allFilters[fk]}`));
  return `?${filterPairs.join('&')}`;
};
