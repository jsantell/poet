var
  fs = require('fs'),
  _ = require('underscore'),
  path = require('path'),
  when = require('when'),
  defer = require('when').defer,
  all = require('when').all,
  nodefn = require('when/node/function'),
  fsThen = require('fs-then'),
  utils = require('./utils'),
  mongoose = require('mongoose'),
  postModel;

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

  clearPosts(poet);

  var promise;
  if (options.storageType == 'database')
    promise = loadFromDatabase(poet);
  else
    promise = loadFromFileSystem(poet);

  if (callback)
    promise.then(callback.bind(null, null), callback.bind(null));

  return promise;
}
exports.init = init;

/**
 * Load posts from database
 * @param poet
 * @returns {Promise}
 */
function loadFromDatabase (poet) {
  return when(getPostModel().find({}, function (err, posts) {
    posts.forEach(function(post, index) {
      var convertedPost = utils.convertPost(post, poet.options);
      poet.posts[convertedPost.slug] = convertedPost;
    });
  })).then(function() {
    // Clear out the cached sorted posts, tags, categories, as this point they
    // could have changed from new posts
    clearCache(poet);
    return poet;
  });
}
exports.loadFromDatabase = loadFromDatabase;

/**
 * Load posts from filesystem
 * @param poet
 * @returns {Promise}
 */
function loadFromFileSystem (poet) {
  var options = poet.options;

  // Get list of files in `options.posts` directory
  return utils.getPostPaths(options.posts).then(function (files) {
    // Generate a collection of promises that resolve
    // to post objects
    var collection = files.reduce(function (coll, file) {
      var template = utils.getTemplate(poet.templates, file);

      // If no template found, ignore (swap file, etc.)
      if (!template) return coll;

      // If template function accepts more than one argument, then handle 2nd
      // argument as asynchronous node-style callback function
      if (template.length > 1) {
        template = function(template, string) {
          var result = defer();
          template(string, nodefn.createCallback(result.resolver));
          return result.promise;
        }.bind(null, template);
      }

      // Do the templating and adding to poet instance
      // here for access to the file name
      var post = utils.createPost(file, options).then(function (post) {
        return all([template(post.content), template(post.preview)]).then(function (contents) {
          post.content = contents[0];
          post.preview = contents[1] + options.readMoreLink(post);
          poet.posts[post.slug] = post;
        });
      }, function (reason) {
          console.error('Unable to parse file ' + file + ': ' + reason);
          post = undefined;
      });

      if (post) {
        coll.push(post);
      }

      return coll;
    }, []);

    return all(collection);
  }).then(function () {
    // Clear out the cached sorted posts, tags, categories, as this point they
    // could have changed from new posts
    clearCache(poet);
    return poet;
  });
}
exports.loadFromFileSystem = loadFromFileSystem;

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
 * Clears posts during init
 * @param {Object} poet
 * @returns {Poet}
 */
function clearPosts (poet) {
  poet.posts = {};
  return poet;
}
exports.clearPosts = clearPosts;

/**
 * Sets up the `poet` instance to watch the posts directory for any changes
 * and calls the callback whenever a change is made
 *
 * @params {Object} poet
 * @params {function} [callback]
 * @returns {Poet}
 */

function watch (poet, callback) {
  if (poet.options.storageType == 'database') {
    setInterval(function() {
      poet.init().then(function () {
      })
    }, poet.options.dbRefreshInterval);
  }
  else {
    fs.watch(poet.options.posts, function (event, filename) {
      poet.init().then(callback);
    });
  }
  return poet;
}
exports.watch = watch;

/**
 * Define schema for post object for mongodb
 * @returns {Schema}
 */
function getPostModel() {
  if (postModel == null) {
    postModel = mongoose.model('Post', new mongoose.Schema({
      date: Date,
      title: String,
      content: String,
      tags: Array,
      categories : Array
    }));
  }
  return postModel;
}