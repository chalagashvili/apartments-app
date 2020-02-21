import reducer from 'state/filters/reducer';
import { setFilter, removeFilter } from 'state/filters/actions';

describe('state/filters/reducer', () => {
  it('should return an object', () => {
    const state = reducer();
    expect(typeof state).toBe('object');
  });

  describe('after action setFilter', () => {
    let state;
    beforeEach(() => {
      state = reducer({}, setFilter('users', 'pricePerMonthFrom', 100));
    });
    it('should define filter', () => {
      expect(state.users.pricePerMonthFrom).toEqual(100);
    });
  });

  describe('after action removeFilter', () => {
    let state;
    beforeEach(() => {
      state = reducer({ users: { pricePerMonthFrom: 100 } }, removeFilter('users', 'pricePerMonthFrom'));
    });
    it('should remove filter', () => {
      expect(state.users.pricePerMonthFrom).not.toBeDefined();
    });
  });
});
