
import { getFilters } from 'state/filters/selectors';

const TEST_STATE = {
  filters: {
    users: {
      pricePerMonthFrom: 100,
    },
  },
};

describe('Check filters selectors', () => {
  it('verify getFilters selector', () => {
    expect(getFilters(TEST_STATE, 'users')).toEqual(TEST_STATE.filters.users);
  });
});

