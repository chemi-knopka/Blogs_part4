const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
require('express-async-errors')

blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})
  
blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)  
  
  // if title and url are missing return 400 response
  if (blog['title'] === undefined && blog['url'] === undefined){
    response.status(400).json({ error: 'missing title and' })    
  }
  
  // if likes property is missing add property like and 0 its value
  if (blog['likes'] === undefined) {
    blog.likes = 0
  }

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)

})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter