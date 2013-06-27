var utils = require( './utils' );

function createHelpers (posts, options) {
  var sortedPosts = utils.getPosts(posts);
  var tags = utils.getTags(posts);
  var categories = utils.getCategories(posts);

  var helpers = {
    posts: sortedPosts,
    tags: tags,
    categories: categories,
    tagURL: createURL(options, 'tag'),
    categoryURL: createURL(options, 'category'),
    pageURL: createURL(options, 'page'),
    getPostCount: function () { return sortedPosts.length; },
    getPost: function (title) { return posts[title]; },
    getPosts: function (from, to) {
      var filtered;
      if (!options.showDrafts) {
        filtered = sortedPosts.filter(function (post) {
          return !post.draft;
        });
      }

      if (from != null && to != null)
        filtered = filtered.slice(from, to);

      return filtered;
    },
    getPageCount: function () {
      return ~~(posts.length / options.postsPerPage);
    },
    postsWithTag: function (tag) {
      return sortedPosts.filter(function (post) {
        return post.tags && ~post.tags.indexOf(tag);
      });
    },
    postsWithCategory: function (category) {
      return sortedPosts.filter(function (post) {
        return post.category === category;
      });
    },
    options: options
  };

  // Alias previous helper names that have been deprecated
  helpers.pageUrl = helpers.pageURL;
  helpers.tagUrl = helpers.tagURL;
  helpers.categoryUrl = helpers.categoryURL;
  helpers.categoryList = helpers.category;
  helpers.postList = helpers.posts;
  helpers.tagList = helpers.tags;
  helpers.sortedPostsWithCategory = helpers.postsWithCategory:
  helpers.sortedPostsWithTag = helpers.postsWithTag:

  return helpers;
};
module.exports = createHelpers;
