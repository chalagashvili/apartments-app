const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const UserSchema = require('../models').userSchema;
const ApartmentSchema = require('../models').apartmentSchema;
const { createUser, signInAndReturnToken, addApartment } = require('./helpers');

const api = supertest(app);

describe('Test users logic', () => {
  let realtorToken = null;
  let realtorId = null;
  let clientToken = null;
  let clientId = null;
  let adminToken = null;
  let initialApartments = null;

  beforeAll(async (done) => {
    await UserSchema.deleteMany({});
    await ApartmentSchema.deleteMany({});
    clientId = await createUser('test-client@gmail.com', '12345678', 'client', 'Client name');
    realtorId = await createUser('test-realtor@gmail.com', '12345678', 'realtor', 'Realtor name');
    await createUser('test-admin@gmail.com', '12345678', 'admin', 'Admin name');
    realtorToken = await signInAndReturnToken('test-realtor@gmail.com', '12345678');
    clientToken = await signInAndReturnToken('test-client@gmail.com', '12345678');
    adminToken = await signInAndReturnToken('test-admin@gmail.com', '12345678');
    initialApartments = [
      {
        owner: realtorId,
        name: 'Apart Hotel 1',
        description: 'Sunny and funny',
        floorAreaSize: 120,
        numberOfRooms: 5,
        isAvailable: true,
        pricePerMonth: 800,
        loc: { coordinates: [40, 41], type: 'Point' },
      },
      {
        owner: realtorId,
        name: 'Apart Hotel 2',
        description: 'Sunny and funny',
        floorAreaSize: 120,
        numberOfRooms: 5,
        isAvailable: true,
        pricePerMonth: 800,
        loc: { coordinates: [40, 41], type: 'Point' },
      },
      {
        owner: realtorId,
        name: 'Apart Hotel 3',
        description: 'Sunny and funny',
        floorAreaSize: 120,
        numberOfRooms: 5,
        isAvailable: true,
        pricePerMonth: 800,
        loc: { coordinates: [40, 41], type: 'Point' },
      },
    ];
    await addApartment(initialApartments[0]);
    await addApartment(initialApartments[1]);
    await addApartment(initialApartments[2]);
    done();
  });

  describe('Tests apartment related login', () => {
    it('Checks getOwnedApartments', async (done) => {
      const checkApartments = (res) => expect(res.body.payload.data.length)
        .toEqual(initialApartments.length);
      await api
        .get(`/users/${realtorId}/apartments`)
        .set('authorization', realtorToken)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect(checkApartments);
      done();
    });

    it('Checks available apartments', async (done) => {
      const checkApartments = (res) => expect(res.body.payload.data.length)
        .toEqual(initialApartments.length);
      await api
        .get('/apartments')
        .set('authorization', clientToken)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect(checkApartments);
      done();
    });

    it('Checks booking an apartment and then unbooking it', async (done) => {
      let bookingApartmentId = null;
      const checkApartments = (res) => {
        const results = res.body.payload.data;
        expect(results.length)
          .toEqual(initialApartments.length);
        // eslint-disable-next-line no-underscore-dangle
        bookingApartmentId = results[0]._id;
      };
      await api
        .get('/apartments')
        .set('authorization', clientToken)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect(checkApartments);
      // Book now
      await api
        .post(`/users/${clientId}/bookings/${bookingApartmentId}`)
        .set('authorization', clientToken)
        .expect(200);
      // fetch all available now
      await api
        .get('/apartments')
        .set('authorization', clientToken)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect((res) => expect(res.body.payload.data.length)
          .toEqual(initialApartments.length - 1));
      // fetch all bookings now
      await api
        .get(`/users/${clientId}/bookings`)
        .set('authorization', clientToken)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect((res) => expect(res.body.payload.data.length).toEqual(1));
      // unbook now
      await api
        .delete(`/users/${clientId}/bookings/${bookingApartmentId}`)
        .set('authorization', clientToken)
        .expect(200);
      // fetch all available now
      await api
        .get('/apartments')
        .set('authorization', clientToken)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect((res) => expect(res.body.payload.data.length).toEqual(initialApartments.length));
      done();
    });

    it('Checks adding apartment', async (done) => {
      await api
        .post(`/users/${realtorId}/apartments`)
        .set('authorization', realtorToken)
        .send({
          name: 'Apart Hotel X',
          description: 'Sunny and funny',
          floorAreaSize: 120,
          numberOfRooms: 5,
          isAvailable: true,
          pricePerMonth: 800,
          loc: { coordinates: [40, 41], type: 'Point' },
        })
        .expect(200)
        .expect('Content-Type', /application\/json/);
      done();
    });

    it('Checks updating apartment', async (done) => {
      let toUpdateId = null;
      await api
        .get(`/users/${realtorId}/apartments`)
        .set('authorization', realtorToken)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect((res) => {
          // eslint-disable-next-line no-underscore-dangle
          toUpdateId = res.body.payload.data[0]._id;
        });
      await api
        .put(`/users/${realtorId}/apartments/${toUpdateId}`)
        .set('authorization', realtorToken)
        .send({
          isAvailable: false,
        })
        .expect(200)
        .expect('Content-Type', /application\/json/);
      await api
        .get(`/users/${realtorId}/apartments/${toUpdateId}`)
        .set('authorization', realtorToken)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect((res) => expect(res.body.payload.isAvailable).toEqual(false));
      done();
    });

    it('Checks deleting apartment', async (done) => {
      let toDeleteId = null;
      await api
        .get(`/users/${realtorId}/apartments`)
        .set('authorization', realtorToken)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect((res) => {
          // eslint-disable-next-line no-underscore-dangle
          toDeleteId = res.body.payload.data[0]._id;
        });
      await api
        .delete(`/users/${realtorId}/apartments/${toDeleteId}`)
        .set('authorization', realtorToken)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      await api
        .get(`/users/${realtorId}/apartments`)
        .set('authorization', realtorToken)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect((res) => expect(res.body.payload.data.length).toEqual(initialApartments.length));
      done();
    });
  });

  describe('Tests users related logic', () => {
    it('Checks fetching all the users', async (done) => {
      await api
        .get('/users')
        .set('authorization', adminToken)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect((res) => expect(res.body.payload.data.length).toEqual(2));
      done();
    });

    it('Checks fetching adding a user', async (done) => {
      await api
        .post('/users')
        .set('authorization', adminToken)
        .send({ email: 'adder@gmail.com', role: 'client' })
        .expect(200)
        .expect('Content-Type', /application\/json/);
      await api
        .get('/users')
        .set('authorization', adminToken)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect((res) => expect(res.body.payload.data.length).toEqual(3));
      done();
    });

    it('Checks fetching editing a user', async (done) => {
      await api
        .put(`/users/${clientId}`)
        .set('authorization', adminToken)
        .send({ name: 'Changed name' })
        .expect(200)
        .expect('Content-Type', /application\/json/);
      await api
        .get(`/users/${clientId}`)
        .set('authorization', adminToken)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect((res) => expect(res.body.payload.data[0].name).toEqual('Changed name'));
      done();
    });

    it('Checks deleting a user', async (done) => {
      await api
        .delete(`/users/${clientId}`)
        .set('authorization', adminToken)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      await api
        .get('/users')
        .set('authorization', adminToken)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect((res) => expect(res.body.payload.data.length).toEqual(2));
      done();
    });
  });


  afterAll(() => {
    mongoose.connection.close();
  });
});
