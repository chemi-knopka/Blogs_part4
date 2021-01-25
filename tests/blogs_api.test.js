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

// getting blogs 
describe('when there are some blogs saved', () => {
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
})


// adding blogs
describe('addition of new blog', () => {
  test('blog post is added successfully by post methoed', async () => {
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
  
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  })
  
  test('if likes are missing will be set to zero', async () => {
    const newBlog = {
      title: 'test', 
      author: 'test', 
      url: 'http://test.com'
    }
  
    const res = await api
      .post('/api/blogs')
      .send(newBlog)
  
    expect(res.body.likes).toBe(0)
  })
  
  test('fail 400 if title and url properties are missing', async () => {
    const newBlog = {
      author: 'test'
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})


// delete specific note
describe('make action on saved notes', () => {
  test('delete specifig blog', async () => {
    const notesAtStart = await helper.blogsInDb()
    
    const noteToDelete = notesAtStart[0]
  
    await api
      .delete(`/api/blogs/${noteToDelete.id}`)
      .expect(204)
  
    const notesAtEnd = await helper.blogsInDb()
    expect(notesAtEnd).toHaveLength(notesAtStart.length - 1) 
  })

  test('likes will be updated in blog post', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const newLikes = {
      likes: 999
    }
    
    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newLikes)
    
    expect(updatedBlog.body.likes).toBe(newLikes.likes)
  })
})



afterAll(() => {
  mongoose.connection.close()
})