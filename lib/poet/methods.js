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
  var deferred = defer();
  var options = poet.options;

  // Get list of files in `options.posts` directory
  fs.readdir(options.posts).then(function (files) {

    // Generate a collection of promises that resolve
    // to data from files that have matching templates
    var collection = files.reduce(function (coll, file) {
      if (!utils.getTemplate(poet.templates, file)) return;
      coll.push(fs.readFile(options.posts + file, 'utf-8'));
    }, []);

    return all(collection);
  }).then(function (data) {
    constructPost(file, data);
  });
    if ( err ) throw err;
    var totalFiles = files.length;
    files.reduce(function (file) {


      fs.readFile( options.posts + file, 'utf-8', function ( err, data ) {
        saveData( err, data, file, template, function () {
          if ( !--totalFiles ) {
            refs();
            locals();
            callback && callback( core );
          }
        });
      });
    });
  });
}

