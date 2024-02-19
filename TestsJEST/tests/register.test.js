const request = require('supertest');

const faker = require('faker');

const { fa } = require('faker/lib/locales');


const apiURL = 'http://localhost:8080/demo-1.0-SNAPSHOT/rest';

describe('Valid Register', () => {
  it('should return valid register', async () => {
    const response = await request(apiURL).post('/user/add')
      .set('Accept', '*/*')
      .set('Content-Type', 'application/json')
      .send({
        username: faker.internet.userName(),
        password: 'antonio',
        email: faker.internet.email(),
        firstname: 'Antonio',
        lastname: 'Maniche',
        phone: '914438462',
        photoURL: 'https://www.google.pt/',
      });
    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toEqual('A new user is created');
  });
});

describe('Invalid Register', () => {
    it('should return invalid register', async () => {
      const response = await request(apiURL).post('/user/add')
        .set('Accept', '*/*')
        .set('Content-Type', 'application/json')
        .send({
          username: 'goncalo',
          password: 'antonio',
          email: 'antonio@gmail.com',
          firstname: 'Antonio',
          lastname: 'Maniche',
          phone: '914438462',
          photoURL: 'https://www.google.pt/',
        });
      expect(response.statusCode).toEqual(409);
      expect(response.body.message).toEqual('Invalid Username');
    });

    it('should return invalid register', async () => {
        const response = await request(apiURL).post('/user/add')
          .set('Accept', '*/*')
          .set('Content-Type', 'application/json')
          .send({
            username: faker.internet.userName(),
            password: 'antonio',
            email: 'goncalofileno@gmail.com',
            firstname: 'Antonio',
            lastname: 'Maniche',
            phone: '914438462',
            photoURL: 'https://www.google.pt/',
          });
        expect(response.statusCode).toEqual(409);
        expect(response.body.message).toEqual('Email already exists');
      });
  });
