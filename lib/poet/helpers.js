var utils = require('./utils');

function createHelpers (poet) {
  var options = poet.options;
  var helpers = {
    getTags: getTags.bind(null, poet),
    getCategories: getCategories.bind(null, poet),
    tagURL: function (val) {
      var route = utils.getRoute(options.routes, 'tag');
      return utils.createURL(route, val);
    },
    categoryURL: function (val) {
      var route = utils.getRoute(options.routes, 'category');
      return utils.createURL(route, val);
    },
    pageURL: function (val) {
      var route = utils.getRoute(options.routes, 'page');
      return utils.createURL(route, val);
    },
    getPostCount: function () { return this.getPosts().length; },
    getPost: function (title) { return poet.posts[title]; },
    getPosts: function (from, to) {
      var posts = getPosts(poet);
      if (from != null && to != null)
        posts = posts.slice(from, to);

      return posts;
    },
    getPageCount: function () {
      return Math.ceil(getPosts(poet).length / options.postsPerPage);
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

  /* Compatability aliases that have been deprecated */
  helpers.pageUrl = helpers.pageURL;
  helpers.tagUrl = helpers.tagURL;
  helpers.categoryUrl = helpers.categoryURL;
  helpers.sortedPostsWithCategory = helpers.postsWithCategory;
  helpers.sortedPostsWithTag = helpers.postsWithTag;

  /*
   * Removed helpers:
   * `postList`
   * `tagList`
   * `categoryList`
   */

  return helpers;
}
module.exports = createHelpers;

/**
 * Takes a `poet` instance and returns the posts in sorted, array form
 *
 * @params {Object} poet
 * @returns {Array}
 */

function getPosts (poet) {
  if (poet.cache.posts)
    return poet.cache.posts;

  var posts = utils.sortPosts(poet.posts).filter(function (post) {
    // Filter out draft posts if showDrafts is false
    return (poet.options.showDrafts || !post.draft) &&
    // Filter out posts in the future if showFuture is false
      (poet.options.showFuture || post.date < Date.now());
  });

  return poet.cache.posts = posts;
}

/**
 * Takes a `poet` instance and returns the tags in sorted, array form
 *
 * @params {Object} poet
 * @returns {Array}
 */

function getTags (poet) {
  return poet.cache.tags || (poet.cache.tags = utils.getTags(getPosts(poet)));
}

/**
 * Takes a `poet` instance and returns the categories in sorted, array form
 *
 * @params {Object} poet
 * @returns {Array}
 */

function getCategories (poet) {
  return poet.cache.categories ||
    (poet.cache.categories = utils.getCategories(getPosts(poet)));
}
