var
  fs = require('fs-then'),
  yamlFm = require('front-matter'),
  jsonFm = require('json-front-matter').parse;

exports.appendSlash = function ( s ) {
  if ( s.charAt( s.length - 1 ) !== '/' ) {
    s += '/';
  }
  return s;
};

exports.stripRouteParams = function ( route ) {
  return route.match( /[^\:]*/ )[0];
}

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
