
import 'test/enzyme-init';

import Cookies from 'js-cookie';
import { getOwnedApartments, postApartment, getApartment, putApartment, deleteApartment, getAvailableApartments } from 'api/apartments';

describe('api/auth', () => {
  beforeEach(() => {
    fetch.resetMocks();
    Cookies.get = jest.fn()
      .mockImplementation(key => ({
        id: '777',
        jwtToken: '123',
      }[key]));
  });

  it('returns a promise for getOwnedApartments', () => {
    const response = getOwnedApartments();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/users/777/apartments/', {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        authorization: '123',
        'Content-Type': 'application/json',
      },
      referrerPolicy: 'no-referrer',
    });
    expect(response).toBeInstanceOf(Promise);
  });

  it('returns a promise for postApartment', () => {
    const requestPayload = { name: 'testname', description: 'good apartment' };
    const response = postApartment(requestPayload);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/users/777/apartments', {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        authorization: '123',
        'Content-Type': 'application/json',
      },
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(requestPayload),
    });
    expect(response).toBeInstanceOf(Promise);
  });

  it('returns a promise for getApartment', () => {
    const response = getApartment('444');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/users/777/apartments/444', {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        authorization: '123',
        'Content-Type': 'application/json',
      },
      referrerPolicy: 'no-referrer',
    });
    expect(response).toBeInstanceOf(Promise);
  });

  it('returns a promise for putApartment', () => {
    const requestPayload = { name: 'testname', description: 'good apartment' };
    const response = putApartment(requestPayload, 444);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/users/777/apartments/444', {
      method: 'PUT',
      cache: 'no-cache',
      headers: {
        authorization: '123',
        'Content-Type': 'application/json',
      },
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(requestPayload),
    });
    expect(response).toBeInstanceOf(Promise);
  });

  it('returns a promise for getApartment', () => {
    const response = deleteApartment('444');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/users/777/apartments/444', {
      method: 'DELETE',
      cache: 'no-cache',
      headers: {
        authorization: '123',
        'Content-Type': 'application/json',
      },
      referrerPolicy: 'no-referrer',
    });
    expect(response).toBeInstanceOf(Promise);
  });

  it('returns a promise for getAvailableApartments', () => {
    const response = getAvailableApartments();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/apartments/', {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        authorization: '123',
        'Content-Type': 'application/json',
      },
      referrerPolicy: 'no-referrer',
    });
    expect(response).toBeInstanceOf(Promise);
  });
});

