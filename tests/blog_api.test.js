const assert = require('node:assert')
const { test, describe, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

describe('when there are initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('unique identifier property of blogs is named id', async () => {
    const response = await api.get('/api/blogs')
    assert.ok(response.body[0].id)
  })

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'Charlie',
      url: 'http://charlie.com',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    const titles = blogsAtEnd.map(b => b.title)
    assert(titles.includes('New Blog'))
  })

  test('if likes property is missing, it defaults to 0', async () => {
    const newBlog = {
      title: 'No Likes Blog',
      author: 'Nobody',
      url: 'http://nolikes.com'
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })

  test('blog without title and url is not added', async () => {
    const newBlog = { author: 'NoTitleNoUrl' }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
      const titles = blogsAtEnd.map(b => b.title)
      assert(!titles.includes(blogToDelete.title))
    })
  })

  describe('updating a blog', () => {
    test('succeeds in updating likes', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedData = { likes: blogToUpdate.likes + 100 }

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedData)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, blogToUpdate.likes + 100)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
