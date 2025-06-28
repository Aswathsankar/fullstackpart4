const supertest = require('supertest');
const app = require('../app');

test('app should initialize without errors', async () => {
  await supertest(app).get('/').expect(404);
});
