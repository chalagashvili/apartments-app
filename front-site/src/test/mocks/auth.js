export const LOGIN_SUCCESS = {
  ok: 1,
  msg: 'Login successfull',
  payload: {
    token: 'testToken',
    role: 'admin',
    _id: '123',
    email: 'test@email.com',
  },
};

export const LOGIN_ERROR = {
  ok: 0,
  msg: 'Email or password incorrect',
};
