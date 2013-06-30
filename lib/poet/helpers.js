var utils = require( './utils' );

function createHelpers (poet, options) {
  var helpers = {
    get posts () { return getPosts(poet); },
    get tags () { return getTags(poet); },
    get categories () { return getCategories(poet); },
    tagURL: createURL(options, 'tag'),
    categoryURL: createURL(options, 'category'),
    pageURL: createURL(options, 'page'),
    getPostCount: function () { return getPosts(poet).length; },
    getPost: function (title) { return poet.posts[title]; },
    getPosts: function (from, to) {
      var filtered;
      if (!options.showDrafts) {
        filtered = getPosts(poet).filter(function (post) {
          return !post.draft;
        });
      }

      if (from != null && to != null)
        filtered = filtered.slice(from, to);

      return filtered;
    },
    getPageCount: function () {
      return ~~(poet.posts.length / options.postsPerPage);
    },
    postsWithTag: function (tag) {
      return getPosts(poet).filter(function (post) {
        return post.tags && ~post.tags.indexOf(tag);
      });
    },
    postsWithCategory: function (category) {
      return getPosts(poet).filter(function (post) {
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

/**
 * Takes a `poet` instance and returns the posts in sorted, array form
 *
 * @params {Object} poet
 * @returns {Array}
 */

function getPosts (poet) {
  return poet.cache.posts || (poet.cache.posts = utils.getPosts(poet.posts));
  
}

/**
 * Takes a `poet` instance and returns the tags in sorted, array form
 *
 * @params {Object} poet
 * @returns {Array}
 */

function getTags (poet) {
  return poet.cache.tags || (poet.cache.tags = utils.getTags(poet.posts));
}

/**
 * Takes a `poet` instance and returns the categories in sorted, array form
 *
 * @params {Object} poet
 * @returns {Array}
 */

function getCategories (poet) {
  return poet.cache.categories ||
    (poet.cache.categories = utils.getCategories(poet.posts));
}
