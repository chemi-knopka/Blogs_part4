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

module.exports = {
  dummy,
  totalLikes,
  favourityBlog
}