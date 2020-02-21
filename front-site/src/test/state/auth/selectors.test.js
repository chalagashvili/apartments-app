
import { getAuthInfo } from 'state/auth/selectors';

const TEST_STATE = {
  auth: {
    email: 'irakli@email.com',
    role: 'client',
    authenticated: true,
    id: 123,
  },
};

describe('Check auth selectors', () => {
  it('verify getAuthInfo selector', () => {
    expect(getAuthInfo(TEST_STATE)).toEqual(TEST_STATE.auth);
  });
});

