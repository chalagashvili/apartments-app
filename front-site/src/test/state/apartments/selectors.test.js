
import { getOwnedApartments, getAvailableApartments, getBookedApartments,
  getEditApartmentLocation, getEditApartment, getEditApartmentAddress } from 'state/apartments/selectors';

const TEST_STATE = {
  apartments: {
    ownedApartments: [{ name: 'a' }],
    availableApartments: [{ name: 'b' }],
    bookedApartments: [{ name: 'c' }],
    location: { longitude: 1, latitude: 2 },
    editApartment: [{ name: 'd' }],
    editApartmentAddress: 'Tbilisi, Georgia',
  },
};

describe('Check apartments selectors', () => {
  it('verify getOwnedApartments selector', () => {
    expect(getOwnedApartments(TEST_STATE)).toEqual(TEST_STATE.apartments.ownedApartments);
  });

  it('verify getAvailableApartments selector', () => {
    expect(getAvailableApartments(TEST_STATE)).toEqual(TEST_STATE.apartments.availableApartments);
  });

  it('verify getBookedApartments selector', () => {
    expect(getBookedApartments(TEST_STATE)).toEqual(TEST_STATE.apartments.bookedApartments);
  });

  it('verify getEditApartmentLocation selector', () => {
    expect(getEditApartmentLocation(TEST_STATE)).toEqual(TEST_STATE.apartments.location);
  });

  it('verify getEditApartment selector', () => {
    expect(getEditApartment(TEST_STATE)).toEqual(TEST_STATE.apartments.editApartment);
  });

  it('verify getEditApartmentAddress selector', () => {
    expect(getEditApartmentAddress(TEST_STATE)).toEqual(TEST_STATE.apartments.editApartmentAddress);
  });
});

