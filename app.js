const mongoose = require('mongoose')
const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

mongoose.connect(config.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogsRouter) // blogs related routes
app.use('/api/users', usersRouter) // users related routes
<<<<<<< HEAD
app.use('/api/login', loginRouter) // login related route
=======
app.use('/api/login', loginRouter) // login related routes
>>>>>>> new

app.use(middleware.errorHandler)

module.exports = app