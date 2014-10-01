var
  fs = require('fs'),
  _ = require('underscore'),
  path = require('path'),
  defer = require('when').defer,
  all = require('when').all,
  when = require('when'),
  nodefn = require('when/node/function'),
  fn = require('when/function'),
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
      var post = utils.createPost(file, options).then(function(post) {
        var viewOpts = {
          source: '',
          filename: file,
          locals: poet.app ? poet.app.locals : {}
        };
        return when.join(fn.call(template, _.extend({}, viewOpts, { source: post.content })),
                         fn.call(template, _.extend({}, viewOpts, { source: post.preview })))
               .then(function(contents) {
                 post.content = contents[0];
                 post.preview = contents[1] + options.readMoreLink(post);
                 return post;
               }, function(err) {
                 console.error('Unable to parse file ' + file + ': ' + err);
                 if (process.env.NODE_ENV === 'production') {
                   return err;
                 }
                 post.content = post.preview = '<pre style="font-family: monospace">' + err + '</pre>';
                 return post;
               });
      }).then(function(post) {
        if (!(post instanceof Error))
          return poet.posts[post.slug] = post;
        delete poet.posts[post.slug];
        return null;
      });

      return coll.concat(post);
    }, []);

    return all(collection);
  }).then(function (allPosts) {
    // Schedule posts that need scheduling
    scheduleFutures(poet, allPosts);

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
  var watcher = fs.watch(poet.options.posts, function (event, filename) {
    poet.init().then(callback);
  });
  poet.watchers.push({
    'watcher': watcher,
    'callback': callback
  });
  return poet;
}
exports.watch = watch;

/**
 * Removes all watchers from the `poet` instance so previously registered
 * callbacks are not called again
 */
function unwatch (poet) {
  poet.watchers.forEach(function (watcher) {
    watcher.watcher.close();
  });
  poet.futures.forEach(function (future) {
    clearTimeout(future);
  });
  poet.watchers = [];
  poet.futures = [];
  return poet;
}
exports.unwatch = unwatch;

/**
 * Schedules a watch event for all posts that are posted in a future date.
 */
function scheduleFutures (poet, allPosts) {
  var now = Date.now();
  var extraTime = 5 * 1000; // 10 seconds buffer
  var min = now - extraTime;

  allPosts.forEach(function (post, i) {
    if (!post) return;
    var postTime = post.date.getTime();

    // if post is in the future
    if (postTime - min > 0) {
      var future = setTimeout(function () {
        poet.watchers.forEach(function (watcher) {
          poet.init().then(watcher.callback);
        });
      }, postTime - min);

      poet.futures.push(future);
    }
  });
}