var
  _ = require('underscore'),
  defer = require('when').defer,
  all = require('when').all,
  fs = require('fs-then'),
  utils = require('./utils'),
  createHelpers = require('./helpers');

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
  var promise = fs.readdir(options.posts).then(function (files) {

    // Generate a collection of promises that resolve
    // to post objects
    var collection = files.reduce(function (coll, file) {
      var template = utils.getTemplate(poet.templates, file);

      // If no template found, ignore (swap file, etc.)
      if (!template) return;

      // Do the templating and adding to poet instance
      // here for access to the file name
      var post = createPost(file, options).then(function (post) {
        post.content = template(post.content);
        poet.posts[file] = post;
      });

      coll.push(post);
    }, []);

    return all(collection);
  }).then(function () {
    poet.helpers = createHelpers(poet.posts, options);
    utils.createLocals(poet.app, poet.helpers);
    return poet.helpers;
  });

  if (callback)
    promise.then(callback.bind(null, null), callback.bind(null));

  return promise;
}
exports.init = init;
