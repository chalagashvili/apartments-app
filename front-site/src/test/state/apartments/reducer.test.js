import reducer from 'state/apartments/reducer';
import { setOwnedApartments,
  setBookedApartments,
  setAvailableApartments,
  setEditApartmentsLocation,
  setEditApartment,
  setEditApartmentAddress } from 'state/apartments/actions';
import { GET_OWNED_APARTMENTS_OK } from 'test/mocks/apartments';

describe('state/apartments/reducer', () => {
  it('should return an object', () => {
    const state = reducer();
    expect(typeof state).toBe('object');
  });

  describe('after action setOwnedApartments', () => {
    let state;
    beforeEach(() => {
      state = reducer({}, setOwnedApartments(GET_OWNED_APARTMENTS_OK.data));
    });
    it('should define owned apartments', () => {
      expect(state.ownedApartments).toEqual(GET_OWNED_APARTMENTS_OK.data);
    });
  });

  describe('after action setAvailableApartments', () => {
    let state;
    beforeEach(() => {
      state = reducer({}, setAvailableApartments(GET_OWNED_APARTMENTS_OK.data));
    });
    it('should define available apartments', () => {
      expect(state.availableApartments).toEqual(GET_OWNED_APARTMENTS_OK.data);
    });
  });

  describe('after action setBookedApartments', () => {
    let state;
    beforeEach(() => {
      state = reducer({}, setBookedApartments(GET_OWNED_APARTMENTS_OK.data));
    });
    it('should define booked apartments', () => {
      expect(state.bookedApartments).toEqual(GET_OWNED_APARTMENTS_OK.data);
    });
  });

  describe('after action setEditApartmentsLocation', () => {
    let state;
    const location = { longitude: 1, latitude: 2 };
    beforeEach(() => {
      state = reducer({}, setEditApartmentsLocation(location));
    });
    it('should define location', () => {
      expect(state.location).toEqual(location);
    });
  });

  describe('after action setEditApartment', () => {
    let state;
    beforeEach(() => {
      state = reducer({}, setEditApartment(GET_OWNED_APARTMENTS_OK.data[0]));
    });
    it('should define edit apartment', () => {
      expect(state.editApartment).toEqual(GET_OWNED_APARTMENTS_OK.data[0]);
    });
  });

  describe('after action setEditApartmentAddress', () => {
    let state;
    const address = 'Tbilisi, Georgia';
    beforeEach(() => {
      state = reducer({}, setEditApartmentAddress(address));
    });
    it('should define address', () => {
      expect(state.editApartmentAddress).toEqual(address);
    });
  });
});
