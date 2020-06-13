// test/app.integration.spec.js
const request = require('supertest');
const app = require('../app');
const connection = require('../connection');

describe('Test routes', () => {
  // truncate bookmark table before each test
  beforeEach (done => connection.query('TRUNCATE bookmark', done));

  it ('GET / sends "Hello World" as json', (done) => {
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
          id: expect.any(Number),
          url: 'https://jestjs.io',
          title: 'Jest'
        };
        expect(response.body).toEqual(expected);
        done();
      });
  });

  // Quête Express et TDD - Tests d'intégration de routes Express
  describe('GET /bookmarks/:id', () => {
    const testBookmark = { url: 'https://nodejs.org/', title: 'Node.js' };
    beforeEach((done) => connection.query(
      'TRUNCATE bookmark', () => connection.query(
        'INSERT INTO bookmark SET ?', testBookmark, done
      )
    ));
  
    // Write your tests HERE!
    it ('GET / return error 404 because id does not exist', (done) => {
      request(app)
        .get('/bookmarks/10000')
        .expect(404)
        .expect('Content-Type', /json/)
        .then(response => {
          const expected = { error: 'Bookmark not found' };
          expect(response.body).toEqual(expected);
          done();
        });
    })

    it ('GET / return 200 with the object from the DB', (done) => {
      request(app)
        .get('/bookmarks/1')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(response => {
          const expected = {
            id: 1,
            url: testBookmark.url,
            title: testBookmark.title
          };
          expect(response.body).toEqual(expected);
          done();
        });
    })
  });

});
