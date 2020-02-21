
import { getUsersList, getUser } from 'state/users/selectors';

const TEST_STATE = {
  users: {
    users: [{ name: 'irakli' }],
    user: { name: 'irakli' },
  },
};

describe('Check users selectors', () => {
  it('verify getUsersList selector', () => {
    expect(getUsersList(TEST_STATE)).toEqual(TEST_STATE.users.users);
  });

  it('verify getUser selector', () => {
    expect(getUser(TEST_STATE)).toEqual(TEST_STATE.users.user);
  });
});

