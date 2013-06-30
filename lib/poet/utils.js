var
  fs = require('fs-then'),
  _ = require('underscore'),
  yamlFm = require('front-matter'),
  jsonFm = require('json-front-matter').parse,
  createDefaults = require('./defaults');

/**
 * Takes an `options` object and merges with the default, creating
 * a new object with
 *
 * @params {Object} options
 * @returns {Object}
 */

function createOptions (options) {
  var defaults = createDefaults();
  options = options || {};
  // Merge options with defaults
  return Object.keys(defaults).reduce(function (coll, prop) {
    // If property is an object, make a clone of it
    if (typeof defaults[prop] === 'object') {
      coll[prop] = _.extend({}, options[prop] || defaults[prop]);
    } else {
      coll[prop] = options[prop] != null ? options[prop] : defaults[prop];
    }
    return coll;
  }, {});
}
exports.createOptions = createOptions;

/**
 * Takes a `route` string (ex: '/post/:post') and
 * replaces it with `value` (ex: '/post/my-blog-post')
 *
 * @params {String} route
 * @params {String} value
 * @returns {String}
 */

function createURL (route, value) {
  return route.match( /[^\:]*/ )[0] + value;
}
exports.createURL = createURL;

/**
 * Takes an express `app` and object of `helpers`
 * that are to be attached to `app` for use in
 * view templates
 *
 * @params {Object} app
 * @params {Object} helpers
 */

function createLocals (app, helpers) {
    app.locals( core );
}
exports.createLocals = createLocals;

/**
 * Takes a `post` object, `body` text and an `options` object
 * and generates preview text in order of priority of a `preview`
 * property on the post, then `previewLength`, followed by
 * finding a `readMoreTag` in the body.
 *
 * Otherwise, use the first paragraph in `body`.
 *
 * @params {Object} post
 * @params {String} body
 * @params {Object} options
 * @return {String}
 */

exports.getPreview = function (post, body, options) {
  var readMoreTag = options.readMoreTag || post.readMoreTag;
  var preview;
  if (post.preview) {
    preview = post.preview;
  } else if (post.previewLength) {
    preview = body.trim().substr(0, post.previewLength);
  } else if (~body.indexOf(readMoreTag)) {
    preview = body.split(readMoreTag)[0];
  } else {
    preview = body.trim().replace(/\n.*/g, '');
  }

  return preview + options.readMoreLink(post);
};

/**
 * Takes `lambda` function and returns a method. When returned method is
 * invoked, it calls the wrapped `lambda` and passes `this` as a first argument
 * and given arguments as the rest.
 *
 * @params {Function} lambda
 * @returns {Function}
 */

function method (lambda) {
  return function () {
    return lambda.apply(null, [this].concat(Array.prototype.slice(arguments)));
  };
}
exports.method = method;

/**
 * Takes a templates hash `templates` and a fileName
 * and returns a templating function if found
 *
 * @params {Object} templates
 * @params {String} fileName
 * @returns {Function|null}
 */

function getTemplate (templates, fileName) {
  var extMatch = fileName.match(/\.(.*)$/);
  if (extMatch && extMatch.length > 1)
    return templates[extMatch[1]];
  return null;
}
exports.getTemplate = getTemplate;

/**
 * Accepts a name of a file and an options hash and returns an object
 * representing a post object
 *
 * @params {String} data
 * @params {String} fileName
 * @params {Object} options
 * @returns {Object}
 */

function createPost (fileName, options) {
  return fs.readFile(options.posts + fileName, 'utf-8').then(function (data) {
    var parsed = (options.metaFormat === 'yaml' ? yamlFm : jsonFm)(data);
    var body = parsed.body;
    var post = parsed.attributes;
    var shortName = fileName.replace(/\.[^\.]*$/, '');

    // If no date defined, create one for current date
    post.date = new Date(post.date);

    post.content = body;
    post.slug = shortName;
    post.url = options.routes.post.match(/[^\:]*/)[0] + shortName;
    post.preview = getPreview(post, body, options);
    return post;
  });
}
exports.createPost = createPost;

/**
 * Takes an array `posts` of post objects and returns a
 * new, sorted version based off of date
 *
 * @params {Array} posts
 * @returns {Array}
 */

function sortPosts (posts) {
  return posts.map(function (post) { return _.extend({}, post); })
    .sort(function (a,b) {
      if ( a.date < b.date ) return 1;
      if ( a.date > b.date ) return -1;
      return 0;
    });
}
exports.sortPosts = sortPosts;

/**
 * Takes an array `posts` of post objects and returns
 * a sorted array with all tags
 *
 * @params {Array} posts
 * @returns {Array}
 */

function getTags (posts) {
  var tags = posts.reduce(function (tags, post) {
    if (!post.tags || !Array.isArray(post.tags)) return;
    return tags.concat(post.tags);
  }, []);

  return _.unique(tags).sort();
}
exports.getTags = getTags;

/**
 * Takes an array `posts` of post objects and returns
 * a sorted array with all categories
 *
 * @params {Array} posts
 * @returns {Array}
 */

function getCategories (posts) {
  var categories = posts.reduce(function (categories, post) {
    if (!post.category) return;
    return categories.concat(post.category);
  }, []);

  return _.unique(categories).sort();
}
exports.getCategories = getCategories;

/**
 * Takes a `route` (ex: '/posts/:post') and returns
 * the name of the parameter (ex: 'post'), which should be a route type
 *
 * @params {String} route
 * @returns {String}
 */

function getRouteType (route) {
  var match = route.match(/\:(post|page|tag|category)[^\w]/);
  if (match && match.length > 1)
    return match[1];
  return null;
}
exports.getRouteType = getRouteType;
