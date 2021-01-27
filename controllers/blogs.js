const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
require('express-async-errors')

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

  const token = getTokenFrom(request)
  const tokenUser = jwt.verify(token, process.env.SECRET)

  if (!token || !tokenUser) {
    return response.status(401).json({ error: 'invalid token'})
  }

  // else if user exists with provided token find that user
  const user = await User.findById(tokenUser.id)
  user.blogs = user.blogs.concat(blog.id)
  await user.save()
  

  // if likes property is missing add property likes and 0 its value
  if (blog['likes'] === undefined) {
    blog.likes = 0
  }

  blog.user = user.id
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