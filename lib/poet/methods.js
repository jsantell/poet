var
  _ = require('underscore');

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
