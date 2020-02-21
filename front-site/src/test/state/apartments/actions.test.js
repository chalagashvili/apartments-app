import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { setOwnedApartments,
  setBookedApartments,
  setEditApartmentsLocation,
  setEditApartment,
  setEditApartmentAddress,
  fetchOwnedApartments,
  setAvailableApartments,
  sendPostApartment,
  sendPutApartment,
  fetchApartment,
  sendDeleteApartment,
  fetchAvailableApartments,
  fetchApartmentAddress } from 'state/apartments/actions';
import { SET_OWNED_APARTMENTS,
  SET_BOOKED_APARTMENTS,
  SET_EDIT_APARTMENT_LOCATION,
  SET_EDIT_APARTMENT,
  SET_EDIT_APARTMENT_ADDRESS,
  SET_AVAILABLE_APARTMENTS } from 'state/apartments/types';
import { getOwnedApartments, postApartment,
  getApartment,
  deleteApartment,
  getAvailableApartments,
  putApartment } from 'api/apartments';
import { getAddressByCoordinates } from 'api/services';
import { GET_OWNED_APARTMENTS_OK, GET_APARTMENT_OK } from 'test/mocks/apartments';
import { TOGGLE_LOADING } from 'state/loading/types';
import { SET_PAGE } from 'state/pagination/types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('api/apartments', () => ({
  getOwnedApartments: jest.fn(),
  postApartment: jest.fn(),
  putApartment: jest.fn(),
  getApartment: jest.fn(),
  deleteApartment: jest.fn(),
  getAvailableApartments: jest.fn(),
}));

jest.mock('api/services', () => ({
  getAddressByCoordinates: jest.fn(),
}));

const GET_OWNED_APARTMENTS_PROMISE = {
  ok: 1,
  json: () => new Promise(res =>
    res({ payload: GET_OWNED_APARTMENTS_OK, metaData: { totalItems: 2 } })),
};

const GET_APARTMENT_PROMISE = {
  ok: 1,
  json: () => new Promise(res =>
    res({ payload: GET_APARTMENT_OK, metaData: { totalItems: 1 } })),
};

const MOCK_RETURN_PROMISE_ERROR = {
  ok: 0,
  json: () => new Promise(res =>
    res({ error: 'some error' })),
};

getAddressByCoordinates.mockReturnValue(new Promise(resolve => resolve(GET_APARTMENT_PROMISE)));
getOwnedApartments.mockReturnValue(new Promise(resolve => resolve(GET_OWNED_APARTMENTS_PROMISE)));
postApartment.mockReturnValue(new Promise(resolve => resolve(GET_OWNED_APARTMENTS_PROMISE)));
putApartment.mockReturnValue(new Promise(resolve => resolve(GET_OWNED_APARTMENTS_PROMISE)));
getApartment.mockReturnValue(new Promise(resolve => resolve(GET_APARTMENT_PROMISE)));
deleteApartment.mockReturnValue(new Promise(resolve => resolve(GET_APARTMENT_PROMISE)));
getAvailableApartments
  . mockReturnValue(new Promise(resolve => resolve(GET_OWNED_APARTMENTS_PROMISE)));

const INITIAL_STATE = {
  form: {},
  apartments: {},
  filters: {},
  pagination: {},
};

describe('apartments actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore(INITIAL_STATE);
  });

  describe('Test simple/sync actions correctness', () => {
    it('test setOwnedApartments action sets the correct type and property', () => {
      const apartments = [{ name: '1' }, { name: '2' }];
      const action = setOwnedApartments(apartments);
      expect(action).toHaveProperty('type', SET_OWNED_APARTMENTS);
      expect(action).toHaveProperty('payload');
      expect(action).toHaveProperty('payload', apartments);
    });

    it('test setAvailableApartments action sets the correct type and property', () => {
      const apartments = [{ name: '1' }, { name: '2' }];
      const action = setAvailableApartments(apartments);
      expect(action).toHaveProperty('type', SET_AVAILABLE_APARTMENTS);
      expect(action).toHaveProperty('payload');
      expect(action).toHaveProperty('payload', apartments);
    });

    it('test setBookedApartments action sets the correct type and property', () => {
      const apartments = [{ name: '1' }, { name: '2' }];
      const action = setBookedApartments(apartments);
      expect(action).toHaveProperty('type', SET_BOOKED_APARTMENTS);
      expect(action).toHaveProperty('payload');
      expect(action).toHaveProperty('payload', apartments);
    });

    it('test setEditApartmentsLocation action sets the correct type and property', () => {
      const location = { longitude: 1, latitude: 2 };
      const action = setEditApartmentsLocation(location);
      expect(action).toHaveProperty('type', SET_EDIT_APARTMENT_LOCATION);
      expect(action).toHaveProperty('payload');
      expect(action).toHaveProperty('payload', location);
    });

    it('test setEditApartment action sets the correct type and property', () => {
      const apartment = { name: 'test', description: 'desc' };
      const action = setEditApartment(apartment);
      expect(action).toHaveProperty('type', SET_EDIT_APARTMENT);
      expect(action).toHaveProperty('payload');
      expect(action).toHaveProperty('payload', apartment);
    });

    it('test setEditApartmentAddress action sets the correct type and property', () => {
      const address = 'Tbilisi, Georgia';
      const action = setEditApartmentAddress(address);
      expect(action).toHaveProperty('type', SET_EDIT_APARTMENT_ADDRESS);
      expect(action).toHaveProperty('payload');
      expect(action).toHaveProperty('payload', address);
    });
  });

  describe('fetchOwnedApartments', () => {
    it('fetchOwnedApartments calls appropriate actions', (done) => {
      store.dispatch(fetchOwnedApartments()).then(() => {
        const actions = store.getActions();
        expect(actions).toHaveLength(4);
        expect(actions[0].type).toEqual(TOGGLE_LOADING);
        expect(actions[1].type).toEqual(SET_OWNED_APARTMENTS);
        expect(actions[2].type).toEqual(SET_PAGE);
        expect(actions[3].type).toEqual(TOGGLE_LOADING);
        done();
      }).catch(done.fail);
    });

    it('apartments are defined and properly valued', (done) => {
      store.dispatch(fetchOwnedApartments()).then(() => {
        const actionPayload = store.getActions()[1].payload;
        expect(actionPayload).toHaveLength(GET_OWNED_APARTMENTS_OK.data.length);
        const apartment = actionPayload[0];
        expect(apartment).toHaveProperty('name', GET_OWNED_APARTMENTS_OK.data[0].name);
        done();
      }).catch(done.fail);
    });

    it('when getOwnedApartments gets error, should behave accordingly', (done) => {
      getOwnedApartments
        .mockReturnValueOnce(new Promise(resolve => resolve(MOCK_RETURN_PROMISE_ERROR)));
      store.dispatch(fetchOwnedApartments()).catch(() => {
        expect(getOwnedApartments).toHaveBeenCalled();
        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions[0].type).toEqual(TOGGLE_LOADING);
        expect(actions[1].type).toEqual(TOGGLE_LOADING);
        done();
      }).catch(done.fail);
    });
  });

  describe('sendPostApartment', () => {
    it('sendPostApartment calls appropriate actions', (done) => {
      store.dispatch(sendPostApartment({ name: 'apart' })).then(() => {
        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions[0].type).toEqual(TOGGLE_LOADING);
        expect(actions[1].type).toEqual(TOGGLE_LOADING);
        done();
      }).catch(done.fail);
    });

    it('when sendPostApartment gets error, should behave accordingly', (done) => {
      postApartment
        .mockReturnValueOnce(new Promise(resolve => resolve(MOCK_RETURN_PROMISE_ERROR)));
      store.dispatch(sendPostApartment()).catch(() => {
        expect(postApartment).toHaveBeenCalled();
        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions[0].type).toEqual(TOGGLE_LOADING);
        expect(actions[1].type).toEqual(TOGGLE_LOADING);
        done();
      }).catch(done.fail);
    });
  });

  describe('sendPutApartment', () => {
    it('sendPutApartment calls appropriate actions', (done) => {
      store.dispatch(sendPutApartment({ name: 'apart' })).then(() => {
        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions[0].type).toEqual(TOGGLE_LOADING);
        expect(actions[1].type).toEqual(TOGGLE_LOADING);
        done();
      }).catch(done.fail);
    });

    it('when sendPutApartment gets error, should behave accordingly', (done) => {
      putApartment
        .mockReturnValueOnce(new Promise(resolve => resolve(MOCK_RETURN_PROMISE_ERROR)));
      store.dispatch(sendPutApartment()).catch(() => {
        expect(putApartment).toHaveBeenCalled();
        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions[0].type).toEqual(TOGGLE_LOADING);
        expect(actions[1].type).toEqual(TOGGLE_LOADING);
        done();
      }).catch(done.fail);
    });
  });

  describe('fetchApartment', () => {
    it('fetchApartment calls appropriate actions', (done) => {
      store.dispatch(fetchApartment(123)).then(() => {
        const actions = store.getActions();
        expect(actions).toHaveLength(3);
        expect(actions[0].type).toEqual(TOGGLE_LOADING);
        expect(actions[1].type).toEqual(SET_EDIT_APARTMENT);
        expect(actions[2].type).toEqual(TOGGLE_LOADING);
        done();
      }).catch(done.fail);
    });

    it('apartments are defined and properly valued', (done) => {
      store.dispatch(fetchApartment(123)).then(() => {
        const actionPayload = store.getActions()[1].payload.data;
        expect(actionPayload).toHaveLength(1);
        const apartment = actionPayload[0];
        expect(apartment).toHaveProperty('name', GET_APARTMENT_OK.data[0].name);
        done();
      }).catch(done.fail);
    });

    it('when getOwnedApartments gets error, should behave accordingly', (done) => {
      getApartment
        .mockReturnValueOnce(new Promise(resolve => resolve(MOCK_RETURN_PROMISE_ERROR)));
      store.dispatch(fetchApartment()).catch(() => {
        expect(getApartment).toHaveBeenCalled();
        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions[0].type).toEqual(TOGGLE_LOADING);
        expect(actions[1].type).toEqual(TOGGLE_LOADING);
        done();
      }).catch(done.fail);
    });
  });

  describe('sendDeleteApartment', () => {
    it('sendDeleteApartment calls appropriate actions', (done) => {
      store.dispatch(sendDeleteApartment(123)).then(() => {
        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions[0].type).toEqual(TOGGLE_LOADING);
        expect(actions[1].type).toEqual(TOGGLE_LOADING);
        done();
      }).catch(done.fail);
    });

    it('when sendDeleteApartment gets error, should behave accordingly', (done) => {
      deleteApartment
        .mockReturnValueOnce(new Promise(resolve => resolve(MOCK_RETURN_PROMISE_ERROR)));
      store.dispatch(sendDeleteApartment()).catch(() => {
        expect(deleteApartment).toHaveBeenCalled();
        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions[0].type).toEqual(TOGGLE_LOADING);
        expect(actions[1].type).toEqual(TOGGLE_LOADING);
        done();
      }).catch(done.fail);
    });
  });

  describe('fetchAvailableApartments', () => {
    it('fetchAvailableApartments calls appropriate actions', (done) => {
      store.dispatch(fetchAvailableApartments()).then(() => {
        const actions = store.getActions();
        expect(actions).toHaveLength(4);
        expect(actions[0].type).toEqual(TOGGLE_LOADING);
        expect(actions[1].type).toEqual(SET_AVAILABLE_APARTMENTS);
        expect(actions[2].type).toEqual(SET_PAGE);
        expect(actions[3].type).toEqual(TOGGLE_LOADING);
        done();
      }).catch(done.fail);
    });

    it('apartments are defined and properly valued', (done) => {
      store.dispatch(fetchAvailableApartments()).then(() => {
        const actionPayload = store.getActions()[1].payload;
        expect(actionPayload).toHaveLength(GET_OWNED_APARTMENTS_OK.data.length);
        const apartment = actionPayload[0];
        expect(apartment).toHaveProperty('name', GET_OWNED_APARTMENTS_OK.data[0].name);
        done();
      }).catch(done.fail);
    });

    it('when fetchAvailableApartments gets error, should behave accordingly', (done) => {
      getAvailableApartments
        .mockReturnValueOnce(new Promise(resolve => resolve(MOCK_RETURN_PROMISE_ERROR)));
      store.dispatch(fetchAvailableApartments()).catch(() => {
        expect(getAvailableApartments).toHaveBeenCalled();
        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions[0].type).toEqual(TOGGLE_LOADING);
        expect(actions[1].type).toEqual(TOGGLE_LOADING);
        done();
      }).catch(done.fail);
    });
  });

  describe('fetchApartmentAddress', () => {
    it('fetchApartmentAddress calls appropriate actions', (done) => {
      store.dispatch(fetchApartmentAddress(1, 2)).then(() => {
        const actions = store.getActions();
        expect(actions).toHaveLength(1);
        expect(actions[0].type).toEqual(SET_EDIT_APARTMENT_ADDRESS);
        done();
      }).catch(done.fail);
    });

    it('when fetchApartmentAddress gets error, should behave accordingly', (done) => {
      getAddressByCoordinates
        .mockReturnValueOnce(new Promise((_, reject) => reject(new Error('some error'))));
      store.dispatch(fetchApartmentAddress(1, 2)).catch(() => {
        expect(getAddressByCoordinates).toHaveBeenCalled();
        const actions = store.getActions();
        expect(actions).toHaveLength(1);
        expect(actions[0].type).toEqual(SET_EDIT_APARTMENT_ADDRESS);
        done();
      }).catch(done.fail);
    });
  });
});
