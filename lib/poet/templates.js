var
  _ = require('underscore'),
  markdown = require('marked'),
  jade = require('jade').compile;

// Configure defaults for marked to keep compatibility
markdown.setOptions({
  sanitize: false,
  pedantic: true
});

/**
 * Returns a fresh copy of default templates. A template function accepts an
 * options object that should have at least a `source` field. A second argument
 * can be a callback in case the compilation is asynchronous.
 *
 * @returns {Object}
 */

function createTemplates () {
  return {
    jade: function (options) { return jade(options.source, {filename: options.filename})(options.locals); },
    markdown: function (options) { return markdown(options.source); },
    md: function (options) { return markdown(options.source); }
  };
}
module.exports = createTemplates;
