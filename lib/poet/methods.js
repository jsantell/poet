var
  _ = require('underscore'),
  defer = require('when').defer,
  all = require('when').all,
  fs = require('fs-then'),
  utils = require('./utils');

/**
 * Merges in `options` with `poet` instance options
 *
 * @params {Poet} poet
 * @params {Object} options
 * @returns {Poet}
 */

function set (poet, options) {
  _.extend(poet.options, options);
  return poet;
}
exports.set = set;

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
  });

  if (callback)
    promise.then(callback.bind(null, null), callback.bind(null));

  return promise;
}

