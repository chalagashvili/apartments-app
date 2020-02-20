
import 'test/enzyme-init';

import { postLogin, postSignUp, postResetPassword, getMe } from 'api/auth';
import Cookies from 'js-cookie';

describe('api/auth', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('returns a promise for signIn', () => {
    const requestPayload = { email: 'test@email.com', password: '12345678' };
    const response = postLogin(requestPayload);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/auth/signIn', {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(requestPayload),
    });
    expect(response).toBeInstanceOf(Promise);
  });

  it('returns a promise for signUp', () => {
    const requestPayload = {
      email: 'test@email.com', password: '12345678', confirmPassword: '12345678', role: 'client',
    };
    const response = postSignUp(requestPayload);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/auth/signUp', {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(requestPayload),
    });
    expect(response).toBeInstanceOf(Promise);
  });

  it('returns a promise for resetPassword', () => {
    const requestPayload = {
      password: '12345678', confirmPassword: '12345678',
    };
    const response = postResetPassword(requestPayload, 'token123');

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/auth/resetPassword/token123', {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(requestPayload),
    });
    expect(response).toBeInstanceOf(Promise);
  });

  it('returns a promise for getMe', () => {
    Cookies.get = jest.fn()
      .mockImplementation(() => '123');
    const response = getMe();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/auth/me', {
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

