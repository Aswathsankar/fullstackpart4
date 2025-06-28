const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');

// Test for dummy function
test('dummy returns one', () => {
  const blogs = [];
  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

// Test data for other tests
const blogs = [
  { title: "Blog 1", author: "Author A", likes: 10 },
  { title: "Blog 2", author: "Author B", likes: 5 },
  { title: "Blog 3", author: "Author A", likes: 15 },
  { title: "Blog 4", author: "Author C", likes: 7 }
];

describe('total likes', () => {
  test('of empty list is zero', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0);
  });

  test('of list with blogs is calculated correctly', () => {
    assert.strictEqual(listHelper.totalLikes(blogs), 37);
  });
});

describe('favorite blog', () => {
  test('of empty list is null', () => {
    assert.strictEqual(listHelper.favoriteBlog([]), null);
  });

  test('returns blog with most likes', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(blogs), blogs[2]);
  });
});

describe('most blogs', () => {
  test('of empty list is null', () => {
    assert.strictEqual(listHelper.mostBlogs([]), null);
  });

  test('returns author with most blogs', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(blogs), { author: "Author A", blogs: 2 });
  });
});

describe('most likes', () => {
  test('of empty list is null', () => {
    assert.strictEqual(listHelper.mostLikes([]), null);
  });

  test('returns author with most total likes', () => {
    assert.deepStrictEqual(listHelper.mostLikes(blogs), { author: "Author A", likes: 25 });
  });
});
