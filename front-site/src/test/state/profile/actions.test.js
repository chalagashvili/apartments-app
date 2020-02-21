import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { getMe } from 'api/auth';
import { GET_PROFILE_OK } from 'test/mocks/profile';
import { TOGGLE_LOADING } from 'state/loading/types';
import { setProfile, fetchProfile } from 'state/profile/actions';
import { SET_PROFILE } from 'state/profile/types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('api/auth', () => ({
  getMe: jest.fn(),
}));

const GET_LOGIN_SUCCESS_PROMISE = {
  ok: 1,
  json: () => new Promise(res =>
    res({ payload: GET_PROFILE_OK, metaData: { totalItems: 2 } })),
};

const MOCK_RETURN_PROMISE_ERROR = {
  ok: 0,
  json: () => new Promise(res =>
    res({ error: 'some error' })),
};

getMe.mockReturnValue(new Promise(resolve => resolve(GET_LOGIN_SUCCESS_PROMISE)));

const INITIAL_STATE = {
  form: {},
  apartments: {},
  filters: {},
  auth: {},
  pagination: {},
};

describe('profile actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore(INITIAL_STATE);
  });

  describe('Test simple/sync actions correctness', () => {
    it('test setAuth action sets the correct type and property', () => {
      const profileInfo = { email: 'irakli@email.com', role: 'admin' };
      const action = setProfile(profileInfo);
      expect(action).toHaveProperty('type', SET_PROFILE);
      expect(action).toHaveProperty('payload');
      expect(action).toHaveProperty('payload', profileInfo);
    });
  });

  describe('fetchProfile', () => {
    const form = { setFieldsValue: jest.fn() };
    it('fetchProfile calls appropriate actions', (done) => {
      store.dispatch(fetchProfile(form)).then(() => {
        const actions = store.getActions();
        expect(actions).toHaveLength(3);
        expect(actions[0].type).toEqual(TOGGLE_LOADING);
        expect(actions[1].type).toEqual(SET_PROFILE);
        expect(actions[2].type).toEqual(TOGGLE_LOADING);
        done();
      }).catch(done.fail);
    });

    it('profile is defined and properly valued', (done) => {
      store.dispatch(fetchProfile(form)).then(() => {
        const actionPayload = store.getActions()[1].payload;
        expect(actionPayload).toEqual(GET_PROFILE_OK.data[0]);
        done();
      }).catch(done.fail);
    });

    it('when fetchProfile gets error, should behave accordingly', (done) => {
      getMe
        .mockReturnValueOnce(new Promise(resolve => resolve(MOCK_RETURN_PROMISE_ERROR)));
      store.dispatch(fetchProfile(form)).catch(() => {
        expect(getMe).toHaveBeenCalled();
        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions[0].type).toEqual(TOGGLE_LOADING);
        expect(actions[1].type).toEqual(TOGGLE_LOADING);
        done();
      }).catch(done.fail);
    });
  });
});
