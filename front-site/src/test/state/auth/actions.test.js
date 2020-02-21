import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { postLogin, postSignUp, postResetPassword } from 'api/auth';
import { LOGIN_SUCCESS, SIGNUP_SUCCESS } from 'test/mocks/auth';
import { TOGGLE_LOADING } from 'state/loading/types';
import { setAuth, clearAuth, sendPostLogin, sendPostSignup, sendPostResetPassword } from 'state/auth/actions';
import { SET_USER_AUTH_INFO, CLEAR_AUTH_INFO } from 'state/auth/types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('api/auth', () => ({
  postLogin: jest.fn(),
  postSignUp: jest.fn(),
  postResetPassword: jest.fn(),
}));

const GET_LOGIN_SUCCESS_PROMISE = {
  ok: 1,
  json: () => new Promise(res =>
    res({ payload: LOGIN_SUCCESS, metaData: { totalItems: 2 } })),
};

const GET_SIGNUP_SUCCESS_PROMISE = {
  ok: 1,
  json: () => new Promise(res =>
    res({ payload: SIGNUP_SUCCESS, metaData: { totalItems: 2 } })),
};

const MOCK_RETURN_PROMISE_ERROR = {
  ok: 0,
  json: () => new Promise(res =>
    res({ error: 'some error' })),
};

postLogin.mockReturnValue(new Promise(resolve => resolve(GET_LOGIN_SUCCESS_PROMISE)));
postSignUp.mockReturnValue(new Promise(resolve => resolve(GET_SIGNUP_SUCCESS_PROMISE)));
postResetPassword.mockReturnValue(new Promise(resolve => resolve(GET_LOGIN_SUCCESS_PROMISE)));

const INITIAL_STATE = {
  form: {},
  apartments: {},
  filters: {},
  auth: {},
  pagination: {},
};

describe('auth actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore(INITIAL_STATE);
  });

  describe('Test simple/sync actions correctness', () => {
    it('test setAuth action sets the correct type and property', () => {
      const authInfo = { email: 'irakli@email.com', token: 'secretToken', role: 'admin' };
      const action = setAuth(authInfo);
      expect(action).toHaveProperty('type', SET_USER_AUTH_INFO);
      expect(action).toHaveProperty('payload');
      expect(action).toHaveProperty('payload', authInfo);
    });

    it('test clearAuth action sets the correct type and property', () => {
      const action = clearAuth();
      expect(action).toHaveProperty('type', CLEAR_AUTH_INFO);
      expect(action).not.toHaveProperty('payload');
    });
  });

  describe('sendPostLogin', () => {
    it('sendPostLogin calls appropriate actions', (done) => {
      store.dispatch(sendPostLogin()).then(() => {
        const actions = store.getActions();
        expect(actions).toHaveLength(3);
        expect(actions[0].type).toEqual(TOGGLE_LOADING);
        expect(actions[1].type).toEqual(SET_USER_AUTH_INFO);
        expect(actions[2].type).toEqual(TOGGLE_LOADING);
        done();
      }).catch(done.fail);
    });

    it('auth is defined and properly valued', (done) => {
      store.dispatch(sendPostLogin()).then(() => {
        const actionPayload = store.getActions()[1].payload;
        expect(actionPayload).toEqual(LOGIN_SUCCESS);
        done();
      }).catch(done.fail);
    });

    it('when getOwnedApartments gets error, should behave accordingly', (done) => {
      postLogin
        .mockReturnValueOnce(new Promise(resolve => resolve(MOCK_RETURN_PROMISE_ERROR)));
      store.dispatch(sendPostLogin()).catch(() => {
        expect(postLogin).toHaveBeenCalled();
        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions[0].type).toEqual(TOGGLE_LOADING);
        expect(actions[1].type).toEqual(TOGGLE_LOADING);
        done();
      }).catch(done.fail);
    });
  });

  describe('sendPostSignup', () => {
    it('sendPostSignup calls appropriate actions', (done) => {
      store.dispatch(sendPostSignup()).then(() => {
        const actions = store.getActions();
        expect(actions).toHaveLength(3);
        expect(actions[0].type).toEqual(TOGGLE_LOADING);
        expect(actions[1].type).toEqual(SET_USER_AUTH_INFO);
        expect(actions[2].type).toEqual(TOGGLE_LOADING);
        done();
      }).catch(done.fail);
    });

    it('auth is defined and properly valued', (done) => {
      store.dispatch(sendPostSignup()).then(() => {
        const actionPayload = store.getActions()[1].payload;
        expect(actionPayload).toEqual(SIGNUP_SUCCESS);
        done();
      }).catch(done.fail);
    });

    it('when getOwnedApartments gets error, should behave accordingly', (done) => {
      postSignUp
        .mockReturnValueOnce(new Promise(resolve => resolve(MOCK_RETURN_PROMISE_ERROR)));
      store.dispatch(sendPostSignup()).catch(() => {
        expect(postSignUp).toHaveBeenCalled();
        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions[0].type).toEqual(TOGGLE_LOADING);
        expect(actions[1].type).toEqual(TOGGLE_LOADING);
        done();
      }).catch(done.fail);
    });
  });

  describe('sendPostResetPassword', () => {
    it('sendPostResetPassword calls appropriate actions', (done) => {
      store.dispatch(sendPostResetPassword()).then(() => {
        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions[0].type).toEqual(TOGGLE_LOADING);
        expect(actions[1].type).toEqual(TOGGLE_LOADING);
        done();
      }).catch(done.fail);
    });

    it('when getOwnedApartments gets error, should behave accordingly', (done) => {
      postResetPassword
        .mockReturnValueOnce(new Promise(resolve => resolve(MOCK_RETURN_PROMISE_ERROR)));
      store.dispatch(sendPostResetPassword()).catch(() => {
        expect(postResetPassword).toHaveBeenCalled();
        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions[0].type).toEqual(TOGGLE_LOADING);
        expect(actions[1].type).toEqual(TOGGLE_LOADING);
        done();
      }).catch(done.fail);
    });
  });
});
