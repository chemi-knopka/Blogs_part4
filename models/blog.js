const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

blogSchema.set('toJSON', {
  transform: (doc, blogObj) => {
    blogObj.id = blogObj._id
    delete blogObj._id
    delete blogObj.__v
  }
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog