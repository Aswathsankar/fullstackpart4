const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ error: 'username and password required' })
    }
    if (username.length < 3 || password.length < 3) {
      return res.status(400).json({ error: 'username and password must be at least 3 characters long' })
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User({ username, name, passwordHash })
    const savedUser = await user.save()
    res.status(201).json(savedUser)
  } catch (err) {
    next(err)
  }
})


usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
  res.json(users)
})

module.exports = usersRouter
