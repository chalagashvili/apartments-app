import reducer from 'state/users/reducer';
import { setUsers, setUser } from 'state/users/actions';
import { GET_USERS_OK } from 'test/mocks/users';

describe('state/profile/reducer', () => {
  it('should return an object', () => {
    const state = reducer();
    expect(typeof state).toBe('object');
  });

  describe('after action setUsers', () => {
    let state;
    beforeEach(() => {
      state = reducer({}, setUsers(GET_USERS_OK.data));
    });
    it('should define users', () => {
      expect(state.users).toEqual(GET_USERS_OK.data);
    });
  });

  describe('after action setUser', () => {
    let state;
    beforeEach(() => {
      state = reducer({}, setUser(GET_USERS_OK.data[0]));
    });
    it('should define user', () => {
      expect(state.user).toEqual(GET_USERS_OK.data[0]);
    });
  });
});
