const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const UserSchema = require('../models').userSchema;
const ApartmentSchema = require('../models').apartmentSchema;

const api = supertest(app);

describe('Test authentication logic', () => {
  let token = null;
  beforeAll(async (done) => {
    await UserSchema.deleteMany({});
    await ApartmentSchema.deleteMany({});
    const user1 = new UserSchema({
      email: 'test@gmail.com',
      password: '12345678',
      role: 'client',
      name: 'Tester name',
    });
    await user1.save();
    done();
  });

  it('Checks that signup is good', async (done) => {
    await api
      .post('/auth/signUp')
      .send({
        password: '12345678',
        confirmPassword: '12345678',
        email: 'irakli@email.com',
        role: 'client',
        name: 'Irakli',
      })
      .expect(200)
      .expect('Content-Type', /application\/json/);
    done();
  });

  it('Checks that signup is failed as user already exists', async (done) => {
    await api
      .post('/auth/signUp')
      .send({
        password: '12345678',
        confirmPassword: '12345678',
        email: 'irakli@email.com',
        role: 'client',
        name: 'Irakli',
      })
      .expect(400)
      .expect('Content-Type', /application\/json/);
    done();
  });

  it('Checks that login is good', async (done) => {
    const checkToken = (res) => {
      const receivedToken = res.body.payload.token;
      expect(receivedToken).not.toBe(null);
      token = receivedToken;
    };
    await api
      .post('/auth/signIn')
      .send({
        password: '12345678',
        email: 'irakli@email.com',
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect(checkToken);
    done();
  });

  it('Checks that login is failed due to incorrect password', async (done) => {
    await api
      .post('/auth/signIn')
      .send({
        password: '123456789',
        email: 'irakli@email.com',
      })
      .expect(401);
    done();
  });

  it('Checks that login is failed due to incorrect email', async (done) => {
    await api
      .post('/auth/signIn')
      .send({
        password: '123456789',
        email: 'irakli@email.com',
      })
      .expect(401);
    done();
  });

  it('Checks that after login, user info is fetched correctly', async (done) => {
    const checkMe = (res) => expect(res.body.payload.role).not.toBe(null);
    await api
      .get('/auth/me')
      .set('authorization', token)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect(checkMe);
    done();
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
