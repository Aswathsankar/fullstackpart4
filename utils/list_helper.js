const dummy = (blogs) => 1;

// Total likes calculation
const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0);

// Favorite blog
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;
  return blogs.reduce((fav, blog) => blog.likes > (fav.likes || 0) ? blog : fav, {});
};

// Most blogs
const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;
  const counts = {};
  blogs.forEach(blog => counts[blog.author] = (counts[blog.author] || 0) + 1);
  const author = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  return { author, blogs: counts[author] };
};

// Most likes
const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;
  const likes = {};
  blogs.forEach(blog => {
    likes[blog.author] = (likes[blog.author] || 0) + (blog.likes || 0);
  });
  const author = Object.keys(likes).reduce((a, b) => likes[a] > likes[b] ? a : b);
  return { author, likes: likes[author] };
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
