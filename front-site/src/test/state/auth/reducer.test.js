import reducer from 'state/auth/reducer';
import { setAuth, clearAuth } from 'state/auth/actions';
import { LOGIN_SUCCESS } from 'test/mocks/auth';

describe('state/auth/reducer', () => {
  it('should return an object', () => {
    const state = reducer();
    expect(typeof state).toBe('object');
  });

  describe('after action setAuth', () => {
    let state;
    beforeEach(() => {
      state = reducer({}, setAuth({ auth: LOGIN_SUCCESS }));
    });
    it('should define auth', () => {
      expect(state.auth).toEqual(LOGIN_SUCCESS);
    });
  });

  describe('after action clearAuth', () => {
    let state;
    beforeEach(() => {
      state = reducer({ auth: { email: 'irakli@email.com' } }, clearAuth());
    });
    it('should undefine auth', () => {
      expect(state.auth).not.toBeDefined();
    });
  });
});
