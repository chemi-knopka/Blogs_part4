const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
<<<<<<< HEAD
=======
const jwt = require('jsonwebtoken')
>>>>>>> new
require('express-async-errors')
const jwt = require('jsonwebtoken')

<<<<<<< HEAD
// get token from authorization header
=======
>>>>>>> new
const getTokenFrom = (request) => {
  const authorizationHeader = request.get('authorization')
  if (authorizationHeader && authorizationHeader.toLowerCase().startsWith('bearer ')) {
    return authorizationHeader.substring(7)
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  
<<<<<<< HEAD
  // get token from authorization header
  const token = getTokenFrom(request)
  // find if user is registered with this token
  const tokenUser = await jwt.verify(token, process.env.SECRET)
  
  // error handling if token or user not found
  if (!token || !tokenUser){
    return response.status(401).json({ error: 'invalid token or token not provided'})
  }

  // if likes property is missing add property like and 0 its value
=======
  // get token using middleware which saved it in the request object
  const tokenUser = jwt.verify(request.token, process.env.SECRET)

  if (!request.token || !tokenUser) {
    return response.status(401).json({ error: 'invalid token'})
  }

  // else if user exists with provided token find that user
  const user = await User.findById(tokenUser.id)
  user.blogs = user.blogs.concat(blog.id)
  await user.save()
  

  // if likes property is missing add property likes and 0 its value
>>>>>>> new
  if (blog['likes'] === undefined) {
    blog.likes = 0
  }

<<<<<<< HEAD
  // find first user to make an user of the newly added blog
  const user = await User.findById(tokenUser.id)
  user.blogs = user.blogs.concat(blog._id)
  await user.save()

  // asign user id to the blogs user
  blog.user = user._id
=======
  blog.user = user.id
>>>>>>> new
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)

})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true} )
  response.json(updatedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter