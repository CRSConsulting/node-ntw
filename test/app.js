const request = require('supertest');
const server = require('../server.js');

describe('GET /', () => {
  it('should return 200 OK', (done) => {
    request(server)
      .get('/')
      .expect(200, done);
  });
});
    // "start": "npm-run-all --parallel security-check open:server",

describe('GET /login', () => {
  it('should return 200 OK', (done) => {
    request(server)
      .get('/login')
      .expect(200, done);
  });
});

describe('GET /signup', () => {
  it('should return 200 OK', (done) => {
    request(server)
      .get('/signup')
      .expect(200, done);
  });
});

describe('GET /api', () => {
  it('should return 200 OK', (done) => {
    request(server)
      .get('/api')
      .expect(200, done);
  });
});

describe('GET /contact', () => {
  it('should return 200 OK', (done) => {
    request(server)
      .get('/contact')
      .expect(200, done);
  });
});

describe('GET /random-url', () => {
  it('should return 404', (done) => {
    request(server)
      .get('/reset')
      .expect(404, done);
  });
});
