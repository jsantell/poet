var
  fs = require('fs-then'),
  _ = require('underscore'),
  path = require('path'),
  all = require('when').all,
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
  return _.extend({}, createDefaults(), options || {});
}
exports.createOptions = createOptions;

/**
 * Takes a `route` string (ex: '/posts/:post') and replaces the parameter with
 * the `value` (ex: '/posts/my-post');
 *
 * @params {String} route
 * @params {String} value
 * @returns {String}
 */

function createURL (route, value) {
  if (!route) {
    return '';
  }
  return encodeURI(route.match(/[^\:]*/)[0] + value);
}
exports.createURL = createURL;

/**
 * Recursively search `dir` and return all file paths as strings in
 * an array
 *
 * @params {String} dir
 * @returns {Array}
 */

function getPostPaths (dir) {
  return fs.readdir(dir).then(function (files) {
    return all(files.map(function (file) {
      var path = pathify(dir, file);
      return fs.stat(path).then(function (stats) {
        return stats.isDirectory() ?
          getPostPaths(path) :
          path;
      });
    }));
  }).then(function (files) {
    return _.flatten(files);
  });
}
exports.getPostPaths = getPostPaths;

/**
 * Takes an express `app` and object of `helpers`
 * that are to be attached to `app` for use in
 * view templates
 *
 * @params {Object} app
 * @params {Object} helpers
 */

function createLocals (app, helpers) {
    _.extend(app.locals, helpers);
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

function getPreview (post, body, options) {
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

  return preview;
}
exports.getPreview = getPreview;

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
    return lambda.apply(null, [this].concat(Array.prototype.slice.call(arguments, 0)));
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
  var extMatch = fileName.match(/\.([^\.]*)$/);
  if (extMatch && extMatch.length > 1)
    return templates[extMatch[1]];
  return null;
}
exports.getTemplate = getTemplate;

function convertStringToSlug(str){
  return str
    .toLowerCase()
    .replace(/[^\w- ]+/g,'')
    .replace(/ +/g,'-');
}

/**
 * Accepts a name of a file and an options hash and returns an object
 * representing a post object
 *
 * @params {String} data
 * @params {String} fileName
 * @params {Object} options
 * @returns {Object}
 */

function createPost (filePath, options) {
  var fileName = path.basename(filePath);
  return fs.readFile(filePath, 'utf-8').then(function (data) {
    var parsed = (options.metaFormat === 'yaml' ? yamlFm : jsonFm)(data);
    var body = parsed.body;
    var post = parsed.attributes;
    // If no date defined, create one for current date
    post.date = new Date(post.date);
    post.content = body;
    // url slug for post
    post.slug = convertStringToSlug(post.slug || post.title);
    post.url = createURL(getRoute(options.routes, 'post'), post.slug);
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
  return Object.keys(posts).map(function (post) { return posts[post]; })
    .sort(function (a,b) {
      if ( a.date < b.date ) return 1;
      if ( a.date > b.date ) return -1;
      return 0;
    });
}
exports.sortPosts = sortPosts;

/**
 * Takes an array `posts` of sorted posts and returns
 * a sorted array with all tags
 *
 * @params {Array} posts
 * @returns {Array}
 */

function getTags (posts) {
  var tags = posts.reduce(function (tags, post) {
    if (!post.tags || !Array.isArray(post.tags)) return tags;
    return tags.concat(post.tags);
  }, []);

  return _.unique(tags).sort();
}
exports.getTags = getTags;

/**
 * Takes an array `posts` of sorted posts and returns
 * a sorted array with all categories
 *
 * @params {Array} posts
 * @returns {Array}
 */

function getCategories (posts) {
  var categories = posts.reduce(function (categories, post) {
    if (!post.category) return categories;
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
  var match = route.match(/\:(post|page|tag|category)\b/);
  if (match && match.length > 1)
    return match[1];
  return null;
}
exports.getRouteType = getRouteType;

/**
 * Takes a hash of `routes`, and a `type` (ex: 'post'), and returns
 * the corresponding route regex as a string. If no route found, returns `null`.
 *
 * @params {Object} routes
 * @params {String} type
 * @returns {String|Null}
 */

function getRoute (routes, type) {
  if (!routes) return null;
  return Object.keys(routes).reduce(function (match, route) {
    return getRouteType(route) === type ? route : match;
  }, null);
}
exports.getRoute = getRoute;

/**
 * Normalizes and joins a path of `dir` and optionally `file`
 *
 * @params {String} dir
 * @params {String} file
 * @returns {String}
 */

function pathify (dir, file) {
  if (file)
    return path.normalize(path.join(dir, file));
  else
    return path.normalize(dir);
}
exports.pathify = pathify;
