const apiURL = 'http://localhost:8080/demo-1.0-SNAPSHOT/rest';
const request = require('supertest');

describe('Get all users', () => {
        it('should return all users if valid username and password are provided', async () => {
                const response = await request(apiURL).get('/user/all')
                    .set('Accept', '*/*')
                    .set('Content-Type', 'application/json')
                    .set({ username: 'goncalo', password: 'goncalo' });
                    console.log(response.body);
                expect(response.statusCode).toEqual(200);
                expect(response.body).toBeInstanceOf(Array);
            });

        it('should return 401 if invalid username and password are provided', async () => {
                const response = await request(apiURL).get('/user/all')
                    .set('Accept', '*/*')
                    .set('Content-Type', 'application/json')
                    .set({ username: 'invalid', password: 'invalid' });
                    console.log(response.body);
                expect(response.statusCode).toEqual(401);
                expect(response.body.message).toEqual('Unauthorized');
            });
});

describe('Get user details', () => {
        it('should return user details if valid username and password are provided', async () => {
                const username = 'goncalo';
                const response = await request(apiURL).get('/user/goncalo')
                    .set('Accept', '*/*')
                    .set('Content-Type', 'application/json')
                    .set({ username: 'goncalo', password: 'goncalo' });

                    console.log(response.body);
                expect(response.statusCode).toEqual(200);
                expect(response.body.username).toEqual(username);
            });

        it('should return 401 if invalid username and password are provided', async () => {
                const username = 'goncalo';
                const response = await request(apiURL).get('/user/goncalo')
                    .set('Accept', '*/*')
                    .set('Content-Type', 'application/json')
                    .set({ username: 'invalid', password: 'invalid' });
                    console.log(response.body);
                expect(response.statusCode).toEqual(401);
                expect(response.body.message).toEqual('Unauthorized');
            });

        it('should return 404 if user does not exist', async () => {
                const username = 'nonexistent';
                const response = await request(apiURL).get('/user/pedro')
                    .set('Accept', '*/*')
                    .set('Content-Type', 'application/json')
                    .set({ username: 'goncalo', password: 'goncalo' });
                    console.log(response.body);
                expect(response.statusCode).toEqual(401);
                expect(response.body.message).toEqual('Unauthorized');
            });
});