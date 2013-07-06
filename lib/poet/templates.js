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
 * Returns a fresh copy of default templates
 *
 * @returns {Object}
 */

function createTemplates () {
 return {
    jade: function (string) { return jade(string)(); },
    markdown: function (string) { return markdown(string); },
    md: function (string) { return markdown(string); }
  };
}
module.exports = createTemplates;
