const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'First Blog',
    author: 'Alice',
    url: 'http://alice.com',
    likes: 5
  },
  {
    title: 'Second Blog',
    author: 'Bob',
    url: 'http://bob.com',
    likes: 10
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = { initialBlogs, blogsInDb }
