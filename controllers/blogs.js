const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

// GET all blogs, with creator's user info populated
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

// POST a new blog, assign any user as creator (e.g., the first user in DB)
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.title || !body.url) {
    return response.status(400).end()
  }

  // Find any user (here: the first one)
  const users = await User.find({})
  if (users.length === 0) {
    return response.status(400).json({ error: 'No users in database' })
  }
  const user = users[0]

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  // Populate user info in response
  const populatedBlog = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1 })
  response.status(201).json(populatedBlog)
})

// DELETE a blog by id
blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

// PUT (update) a blog by id
blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const updatedBlog = { title, author, url, likes }

  const result = await Blog.findByIdAndUpdate(
    request.params.id,
    updatedBlog,
    { new: true, runValidators: true, context: 'query' }
  ).populate('user', { username: 1, name: 1 })

  if (result) {
    response.json(result)
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter
