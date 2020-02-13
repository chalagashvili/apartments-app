import Cookies from 'js-cookie';

export const isInteger = attribute => (
  !Number.isNaN(parseFloat(attribute)) && Number.isInteger(parseFloat(attribute))
);

export const setCookie = (key, val) => Cookies.set(key, val, {
  secure: process.env.NODE_ENV === 'production', domain: process.env.REACT_APP_PUBLIC_DOMAIN, sameSite: 'strict', expires: 1,
});

export const removeCookie = key => Cookies.remove(key);
