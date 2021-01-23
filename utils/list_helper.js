const _ = require('lodash')

// just dummy test
const dummy = (blogs) => {
  return 1
}

// returns sum of likes 
const totalLikes = (blogs) => {
  const reducer = (sum, item) => sum + item.likes

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

// returns blog with the most likes
const favourityBlog = (blogs) => {
  if (blogs.length === 0){return 0}

  const bestBlog = blogs.reduce((prev, current) => {
    return (prev.likes >= current.likes) ? prev : current
  })

  return bestBlog
}

// returns author with the most blogs and blogs count
const mostBlog = (blogs) => {
  if (blogs.length === 0) {return 0}

  const res = _.groupBy(blogs, (blog) => blog.author)
  const entries = Object.entries(res)

  const sorted = _.sortBy(entries, (item) => item[1].length)

  const bestAuthor = sorted[sorted.length-1]
  return {
    author: bestAuthor[0],
    blogs: bestAuthor[1].length
  }

}

module.exports = {
  dummy,
  totalLikes,
  favourityBlog,
  mostBlog
}