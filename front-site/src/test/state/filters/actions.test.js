import { setFilter, removeFilter } from 'state/filters/actions';
import { SET_FILTER, REMOVE_FILTER } from 'state/filters/types';


describe('filters actions', () => {
  describe('Test simple/sync actions correctness', () => {
    it('test setAuth action sets the correct type and property', () => {
      const action = setFilter('users', 'pricePerMonthFrom', 100);
      expect(action).toHaveProperty('type', SET_FILTER);
      expect(action).toHaveProperty('payload');
      expect(action.payload).toHaveProperty('name', 'users');
      expect(action.payload).toHaveProperty('key', 'pricePerMonthFrom');
      expect(action.payload).toHaveProperty('value', 100);
    });

    it('test clearAuth action sets the correct type and property', () => {
      const action = removeFilter('users', 'pricePerMonthFrom');
      expect(action).toHaveProperty('type', REMOVE_FILTER);
      expect(action.payload).toHaveProperty('name', 'users');
      expect(action.payload).toHaveProperty('key', 'pricePerMonthFrom');
    });
  });
});
