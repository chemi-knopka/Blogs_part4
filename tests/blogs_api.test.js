const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('../utils/blog_list_helper')
const api = supertest(app)

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


afterAll(() => {
  mongoose.connection.close()
})