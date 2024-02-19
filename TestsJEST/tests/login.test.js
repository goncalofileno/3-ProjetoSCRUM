const request = require('supertest');

const apiURL = 'http://localhost:8080/demo-1.0-SNAPSHOT/rest';

describe('Valid login', () => {
  it('should return valid login', async () => {
    const response = await request(apiURL).post('/user/login')
      .set('Accept', '*/*')
      .set('Content-Type', 'application/json')
      .set({ username: 'goncalo', password: 'goncalo' });
      console.log(response.body);
    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toEqual('Valid Login');
  });
});
