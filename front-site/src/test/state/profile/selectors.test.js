
import { getProfile } from 'state/profile/selectors';

const TEST_STATE = {
  profile: {
    name: 'irakli',
  },
};

describe('Check profile selectors', () => {
  it('verify getProfile selector', () => {
    expect(getProfile(TEST_STATE)).toEqual(TEST_STATE.profile);
  });
});

