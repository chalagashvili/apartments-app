
import 'test/enzyme-init';

import Cookies from 'js-cookie';
import { postBooking, getBookings, deleteBooking,
  getUsers, deleteUser, postNewUser, getUser } from 'api/users';

describe('api/users', () => {
  beforeEach(() => {
    fetch.resetMocks();
    Cookies.get = jest.fn()
      .mockImplementation(key => ({
        id: '777',
        jwtToken: '123',
      }[key]));
  });

  it('returns a promise for postBooking', () => {
    const response = postBooking(444);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/users/777/bookings/444', {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        authorization: '123',
        'Content-Type': 'application/json',
      },
      referrerPolicy: 'no-referrer',
    });
    expect(response).toBeInstanceOf(Promise);
  });

  it('returns a promise for getBookings', () => {
    const response = getBookings();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/users/777/bookings/', {
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

  it('returns a promise for deleteBooking', () => {
    const response = deleteBooking(444);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/users/777/bookings/444', {
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

  it('returns a promise for getUsers', () => {
    const response = getUsers();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/users/', {
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

  it('returns a promise for deleteUser', () => {
    const response = deleteUser(444);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/users/444', {
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

  it('returns a promise for postNewUser', () => {
    const requestPayload = { name: 'irakli', email: 'irakli@gmail.com' };
    const response = postNewUser(requestPayload);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/users', {
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

  it('returns a promise for getUser', () => {
    const response = getUser(444);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/users/444', {
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
