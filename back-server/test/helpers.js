const supertest = require('supertest');
const UserSchema = require('../models').userSchema;
const ApartmentSchema = require('../models').apartmentSchema;
const app = require('../app');

const api = supertest(app);

exports.signInAndReturnToken = async (email, password) => {
  // Log in user to use its token
  let token = null;
  const checkToken = (res) => {
    const receivedToken = res.body.payload.token;
    expect(receivedToken).not.toBe(null);
    token = receivedToken;
  };
  await api
    .post('/auth/signIn')
    .send({
      password,
      email,
    })
    .expect(200)
    .expect('Content-Type', /application\/json/)
    .expect(checkToken);
  return token;
};

exports.createUser = async (email, password, role, name) => {
  const user = new UserSchema({
    email,
    password,
    role,
    name,
  });
  const saved = await user.save();
  // eslint-disable-next-line no-underscore-dangle
  return saved._id;
};

exports.addApartment = async (data) => {
  const apartment = new ApartmentSchema(data);
  const saved = await apartment.save();
  // eslint-disable-next-line no-underscore-dangle
  return saved._id;
};
