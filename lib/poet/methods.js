var
  fs = require('fs'),
  _ = require('underscore'),
  path = require('path'),
  defer = require('when').defer,
  all = require('when').all,
  fsThen = require('fs-then'),
  utils = require('./utils');

/**
 * Adds `data.fn` as a template formatter for all files with
 * extension `data.ext`, which may be a string or an array of strings.
 * Adds to `poet` instance templates.
 *
 * @params {Poet} poet
 * @params {Object} data
 * @returns {Poet}
 */

function addTemplate (poet, data) {
  if (!data.ext || !data.fn)
    throw new Error('Template must have both an extension and formatter function');

  [].concat(data.ext).map(function (ext) {
    poet.templates[ext] = data.fn;
  });

  return poet;
}
exports.addTemplate = addTemplate;

/**
 * Takes a `poet` instance and an optional `callback` -- reads
 * all post files and constructs the instance's `posts` data structure
 * with post objects and creates the instance's helper functions.
 * Returns a promise for completion.
 *
 * @params {Object} poet
 * @params {Function} [callback]
 * @returns {Promise}
 */

function init (poet, callback) {
  var options = poet.options;

  // Get list of files in `options.posts` directory
  var promise = utils.getPostPaths(options.posts).then(function (files) {
    // Generate a collection of promises that resolve
    // to post objects
    var collection = files.reduce(function (coll, file) {
      var template = utils.getTemplate(poet.templates, file);

      // If no template found, ignore (swap file, etc.)
      if (!template) return coll;

      // Do the templating and adding to poet instance
      // here for access to the file name
      var post = utils.createPost(file, options).then(function (post) {
        post.content = template(post.content);
        post.preview = template(post.preview) + options.readMoreLink(post);
        poet.posts[post.slug] = post;
      });

      coll.push(post);
      return coll;
    }, []);

    return all(collection);
  }).then(function () {
    // Clear out the cached sorted posts, tags, categories, as this point they
    // could have changed from new posts
    clearCache(poet);
    return poet;
  });

  if (callback)
    promise.then(callback.bind(null, null), callback.bind(null));

  return promise;
}
exports.init = init;

/**
 * Clears the `poet` instance's 'cache' object -- useful when modifying 
 * posts dynamically
 *
 * @params {Object} poet
 * @returns {Poet}
 */
function clearCache (poet) {
  poet.cache = {};
  return poet;
}
exports.clearCache = clearCache;

/**
 * Sets up the `poet` instance to watch the posts directory for any changes
 * and calls the callback whenever a change is made
 *
 * @params {Object} poet
 * @params {function} [callback]
 * @returns {Poet}
 */

function watch (poet, callback) {
  fs.watch(poet.options.posts, function (event, filename) {
    poet.init().then(callback);
  });
  return poet;
}
exports.watch = watch;
