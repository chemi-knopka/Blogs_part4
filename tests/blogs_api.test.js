const mongoose = require('mongoose')
const Blog = require('../models/blog')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('../utils/blog_list_helper')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    const blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('returns all blogs', async () => {
  const blogs = await api.get('/api/blogs')

  expect(blogs.body).toHaveLength(helper.initialBlogs.length)
})

test('unique identifier is "id" not "_id"', async () => {
  const blogs = await api.get('/api/blogs')

    
  blogs.body.forEach((blog) => {
    expect(blog.id).toBeDefined()
  })
})

test.only('blog post is added successfully by post methoed', async () => {
  const newBlog = {
    title: 'test', 
    author: 'test', 
    url: 'http://test.com', 
    likes: 0 
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect('Content-Type', /application\/json/)

//   const blogsAtEnd = helper.blogsInDb()
  const blogsAtEnd = await api.get('/api/blogs')

  expect(blogsAtEnd.body).toHaveLength(helper.initialBlogs.length + 1)
})


afterAll(() => {
  mongoose.connection.close()
})