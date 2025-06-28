const express = require('express');
const mongoose = require('mongoose');
const config = require('./utils/config');
const logger = require('./utils/logger');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users'); // ADDED


// Add to app.js after routes
app.use((error, request, response, next) => {
  console.error(error.message);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' });
  }
  response.status(500).end();
});


const app = express();

mongoose.connect(config.MONGODB_URI)
  .then(() => logger.info('Connected to MongoDB'))
  .catch(error => logger.error('Error connecting:', error.message));

// Enhanced error handler
const errorHandler = (error, req, res, next) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000')) {
    return res.status(400).json({ error: 'expected `username` to be unique' });
  }
  next(error);
};

app.use(express.json());
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter); // ADDED
app.use(errorHandler); // ADDED

module.exports = app;
