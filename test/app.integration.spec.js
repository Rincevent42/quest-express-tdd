// test/app.integration.spec.js
const request = require('supertest');
const app = require('../app');

describe('Test routes', () => {
  it('GET / sends "Hello World" as json', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        const expected = { message: 'Hello World!' };
        expect(response.body).toEqual(expected);
        done();
      });
  });

  it ('POST /bookmarks with missing title field', (done) => {
    request(app)
      .post('/bookmarks')
      .send({ })
      .expect(422)
      .expect('Content-Type', /json/)
      .then(response => {
        const expected = { error: 'required field(s) missing' };
        expect(response.body).toEqual(expected);
        done();
      });
  });

  it ('POST /bookmarks success', (done) => {
    request(app)
      .post('/bookmarks')
      .send({ 
        title: 'Jest',
        url: 'https://jestjs.io'
      })
      .expect(201)
      .expect('Content-Type', /json/)
      .then(response => {
        const expected = { 
          id: 1,
          url: 'https://jestjs.io',
          title: 'Jest'
        };
        expect(response.body).toEqual(expected);
        done();
      });
  });

});
