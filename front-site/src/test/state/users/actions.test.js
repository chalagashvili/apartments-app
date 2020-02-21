import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { putUser, postBooking, getBookings, deleteBooking,
  getUsers, deleteUser, postNewUser, getUser } from 'api/users';
import { GET_PROFILE_OK } from 'test/mocks/profile';
import { TOGGLE_LOADING, TOGGLE_GROUP_ITEM_LOADING } from 'state/loading/types';
import { setUsers, setUser, sendPutUser, sendPostBooking,
  sendDeleteBooking,
  fetchBookings,
  fetchUsers,
  sendDeleteUser,
  sendPostNewUser,
  fetchUser } from 'state/users/actions';
import { SET_USERS, SET_USER_SINGLE } from 'state/users/types';
import { SET_BOOKED_APARTMENTS } from 'state/apartments/types';
import { GET_AVAILABLE_APARTMENTS_OK } from 'test/mocks/apartments';
import { GET_USERS_OK } from 'test/mocks/users';
import { SET_PAGE } from 'state/pagination/types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('api/users', () => ({
  putUser: jest.fn(),
  postBooking: jest.fn(),
  getBookings: jest.fn(),
  deleteBooking: jest.fn(),
  getUsers: jest.fn(),
  deleteUser: jest.fn(),
  postNewUser: jest.fn(),
  getUser: jest.fn(),
}));

const GET_LOGIN_SUCCESS_PROMISE = {
  ok: 1,
  json: () => new Promise(res =>
    res({ payload: GET_PROFILE_OK, metaData: { totalItems: 2 } })),
};

const GET_BOOKINGS_SUCCESS_PROMISE = {
  ok: 1,
  json: () => new Promise(res =>
    res({ payload: GET_AVAILABLE_APARTMENTS_OK, metaData: { totalItems: 2 } })),
};

const GET_USERS_SUCCESS_PROMISE = {
  ok: 1,
  json: () => new Promise(res =>
    res({ payload: GET_USERS_OK, metaData: { totalItems: 2 } })),
};

const MOCK_RETURN_PROMISE_ERROR = {
  ok: 0,
  json: () => new Promise(res =>
    res({ error: 'some error' })),
};

putUser.mockReturnValue(new Promise(resolve => resolve(GET_LOGIN_SUCCESS_PROMISE)));
postBooking.mockReturnValue(new Promise(resolve => resolve(GET_LOGIN_SUCCESS_PROMISE)));
getBookings.mockReturnValue(new Promise(resolve => resolve(GET_BOOKINGS_SUCCESS_PROMISE)));
deleteBooking.mockReturnValue(new Promise(resolve => resolve(GET_LOGIN_SUCCESS_PROMISE)));
getUsers.mockReturnValue(new Promise(resolve => resolve(GET_USERS_SUCCESS_PROMISE)));
deleteUser.mockReturnValue(new Promise(resolve => resolve(GET_LOGIN_SUCCESS_PROMISE)));
postNewUser.mockReturnValue(new Promise(resolve => resolve(GET_LOGIN_SUCCESS_PROMISE)));
getUser.mockReturnValue(new Promise(resolve => resolve(GET_USERS_SUCCESS_PROMISE)));

const INITIAL_STATE = {
  form: {},
  apartments: {},
  filters: {},
  auth: {},
  pagination: {},
};

describe('users actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore(INITIAL_STATE);
  });

  describe('Test simple/sync actions correctness', () => {
    it('test setUsers action sets the correct type and property', () => {
      const users = [{ email: 'irakli@email.com', role: 'admin' }];
      const action = setUsers(users);
      expect(action).toHaveProperty('type', SET_USERS);
      expect(action).toHaveProperty('payload');
      expect(action).toHaveProperty('payload', users);
    });

    it('test setUser action sets the correct type and property', () => {
      const user = { email: 'irakli@email.com', role: 'admin' };
      const action = setUser(user);
      expect(action).toHaveProperty('type', SET_USER_SINGLE);
      expect(action).toHaveProperty('payload');
      expect(action).toHaveProperty('payload', user);
    });
  });

  describe('sendPutUser', () => {
    it('sendPutUser calls appropriate actions', (done) => {
      store.dispatch(sendPutUser()).then(() => {
        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions[0].type).toEqual(TOGGLE_LOADING);
        expect(actions[1].type).toEqual(TOGGLE_LOADING);
        done();
      }).catch(done.fail);
    });

    it('when sendPutUser gets error, should behave accordingly', (done) => {
      putUser
        .mockReturnValueOnce(new Promise(resolve => resolve(MOCK_RETURN_PROMISE_ERROR)));
      store.dispatch(sendPutUser()).catch(() => {
        expect(putUser).toHaveBeenCalled();
        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions[0].type).toEqual(TOGGLE_LOADING);
        expect(actions[1].type).toEqual(TOGGLE_LOADING);
        done();
      }).catch(done.fail);
    });
  });

  describe('sendPostBooking', () => {
    it('sendPostBooking calls appropriate actions', (done) => {
      store.dispatch(sendPostBooking()).then(() => {
        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions[0].type).toEqual(TOGGLE_GROUP_ITEM_LOADING);
        expect(actions[1].type).toEqual(TOGGLE_GROUP_ITEM_LOADING);
        done();
      }).catch(done.fail);
    });

    it('when sendPostBooking gets error, should behave accordingly', (done) => {
      postBooking
        .mockReturnValueOnce(new Promise(resolve => resolve(MOCK_RETURN_PROMISE_ERROR)));
      store.dispatch(sendPostBooking()).catch(() => {
        expect(postBooking).toHaveBeenCalled();
        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions[0].type).toEqual(TOGGLE_GROUP_ITEM_LOADING);
        expect(actions[1].type).toEqual(TOGGLE_GROUP_ITEM_LOADING);
        done();
      }).catch(done.fail);
    });
  });

  describe('sendDeleteBooking', () => {
    it('sendDeleteBooking calls appropriate actions', (done) => {
      store.dispatch(sendDeleteBooking()).then(() => {
        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions[0].type).toEqual(TOGGLE_GROUP_ITEM_LOADING);
        expect(actions[1].type).toEqual(TOGGLE_GROUP_ITEM_LOADING);
        done();
      }).catch(done.fail);
    });

    it('when sendDeleteBooking gets error, should behave accordingly', (done) => {
      deleteBooking
        .mockReturnValueOnce(new Promise(resolve => resolve(MOCK_RETURN_PROMISE_ERROR)));
      store.dispatch(sendDeleteBooking()).catch(() => {
        expect(deleteBooking).toHaveBeenCalled();
        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions[0].type).toEqual(TOGGLE_GROUP_ITEM_LOADING);
        expect(actions[1].type).toEqual(TOGGLE_GROUP_ITEM_LOADING);
        done();
      }).catch(done.fail);
    });
  });

  describe('fetchBookings', () => {
    it('fetchBookings calls appropriate actions', (done) => {
      store.dispatch(fetchBookings(123)).then(() => {
        const actions = store.getActions();
        expect(actions).toHaveLength(4);
        expect(actions[0].type).toEqual(TOGGLE_LOADING);
        expect(actions[1].type).toEqual(SET_BOOKED_APARTMENTS);
        expect(actions[2].type).toEqual(SET_PAGE);
        expect(actions[3].type).toEqual(TOGGLE_LOADING);
        done();
      }).catch(done.fail);
    });

    it('apartments are defined and properly valued', (done) => {
      store.dispatch(fetchBookings(123)).then(() => {
        const actionPayload = store.getActions()[1].payload;
        expect(actionPayload).toHaveLength(1);
        expect(actionPayload).toEqual(GET_AVAILABLE_APARTMENTS_OK.data);
        done();
      }).catch(done.fail);
    });

    it('when fetchBookings gets error, should behave accordingly', (done) => {
      getBookings
        .mockReturnValueOnce(new Promise(resolve => resolve(MOCK_RETURN_PROMISE_ERROR)));
      store.dispatch(fetchBookings()).catch(() => {
        expect(getBookings).toHaveBeenCalled();
        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions[0].type).toEqual(TOGGLE_LOADING);
        expect(actions[1].type).toEqual(TOGGLE_LOADING);
        done();
      }).catch(done.fail);
    });
  });

  describe('fetchUsers', () => {
    it('fetchUsers calls appropriate actions', (done) => {
      store.dispatch(fetchUsers()).then(() => {
        const actions = store.getActions();
        expect(actions).toHaveLength(4);
        expect(actions[0].type).toEqual(TOGGLE_LOADING);
        expect(actions[1].type).toEqual(SET_USERS);
        expect(actions[2].type).toEqual(SET_PAGE);
        expect(actions[3].type).toEqual(TOGGLE_LOADING);
        done();
      }).catch(done.fail);
    });

    it('apartments are defined and properly valued', (done) => {
      store.dispatch(fetchUsers()).then(() => {
        const actionPayload = store.getActions()[1].payload;
        expect(actionPayload).toHaveLength(1);
        expect(actionPayload).toEqual(GET_USERS_OK.data);
        done();
      }).catch(done.fail);
    });

    it('when fetchUsers gets error, should behave accordingly', (done) => {
      getUsers
        .mockReturnValueOnce(new Promise(resolve => resolve(MOCK_RETURN_PROMISE_ERROR)));
      store.dispatch(fetchUsers()).catch(() => {
        expect(getUsers).toHaveBeenCalled();
        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions[0].type).toEqual(TOGGLE_LOADING);
        expect(actions[1].type).toEqual(TOGGLE_LOADING);
        done();
      }).catch(done.fail);
    });
  });

  describe('sendDeleteUser', () => {
    it('sendDeleteUser calls appropriate actions', (done) => {
      store.dispatch(sendDeleteUser()).then(() => {
        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions[0].type).toEqual(TOGGLE_GROUP_ITEM_LOADING);
        expect(actions[1].type).toEqual(TOGGLE_GROUP_ITEM_LOADING);
        done();
      }).catch(done.fail);
    });

    it('when sendDeleteUser gets error, should behave accordingly', (done) => {
      deleteUser
        .mockReturnValueOnce(new Promise(resolve => resolve(MOCK_RETURN_PROMISE_ERROR)));
      store.dispatch(sendDeleteUser()).catch(() => {
        expect(deleteUser).toHaveBeenCalled();
        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions[0].type).toEqual(TOGGLE_GROUP_ITEM_LOADING);
        expect(actions[1].type).toEqual(TOGGLE_GROUP_ITEM_LOADING);
        done();
      }).catch(done.fail);
    });
  });

  describe('sendPostNewUser', () => {
    it('sendPostNewUser calls appropriate actions', (done) => {
      store.dispatch(sendPostNewUser()).then(() => {
        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions[0].type).toEqual(TOGGLE_LOADING);
        expect(actions[1].type).toEqual(TOGGLE_LOADING);
        done();
      }).catch(done.fail);
    });

    it('when sendPostNewUser gets error, should behave accordingly', (done) => {
      postNewUser
        .mockReturnValueOnce(new Promise(resolve => resolve(MOCK_RETURN_PROMISE_ERROR)));
      store.dispatch(sendPostNewUser()).catch(() => {
        expect(postNewUser).toHaveBeenCalled();
        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions[0].type).toEqual(TOGGLE_LOADING);
        expect(actions[1].type).toEqual(TOGGLE_LOADING);
        done();
      }).catch(done.fail);
    });
  });

  describe('fetchUser', () => {
    const form = { setFieldsValue: jest.fn() };
    it('fetchUser calls appropriate actions', (done) => {
      store.dispatch(fetchUser(123, form)).then(() => {
        const actions = store.getActions();
        expect(actions).toHaveLength(3);
        expect(actions[0].type).toEqual(TOGGLE_LOADING);
        expect(actions[1].type).toEqual(SET_USER_SINGLE);
        expect(actions[2].type).toEqual(TOGGLE_LOADING);
        done();
      }).catch(done.fail);
    });

    it('apartments are defined and properly valued', (done) => {
      store.dispatch(fetchUser(123, form)).then(() => {
        const actionPayload = store.getActions()[1].payload;
        expect(actionPayload).toEqual(GET_USERS_OK.data[0]);
        done();
      }).catch(done.fail);
    });

    it('when fetchUser gets error, should behave accordingly', (done) => {
      getUser
        .mockReturnValueOnce(new Promise(resolve => resolve(MOCK_RETURN_PROMISE_ERROR)));
      store.dispatch(fetchUser(123, form)).catch(() => {
        expect(getUser).toHaveBeenCalled();
        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions[0].type).toEqual(TOGGLE_LOADING);
        expect(actions[1].type).toEqual(TOGGLE_LOADING);
        done();
      }).catch(done.fail);
    });
  });
});
