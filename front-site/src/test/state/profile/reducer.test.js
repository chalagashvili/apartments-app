import reducer from 'state/profile/reducer';
import { setProfile } from 'state/profile/actions';

describe('state/profile/reducer', () => {
  it('should return an object', () => {
    const state = reducer();
    expect(typeof state).toBe('object');
  });

  describe('after action setAuth', () => {
    let state;
    const profile = { email: 'irakli@email.com' };
    beforeEach(() => {
      state = reducer({}, setProfile(profile));
    });
    it('should define auth', () => {
      expect(state).toEqual(profile);
    });
  });
});
