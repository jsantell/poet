var
  markdown = require('marked'),
  jade = require('jade').compile;

// Configure defaults for marked to keep compatibility
markdown.setOptions({
  sanitize: false,
  pedantic: true
});

module.exports = {
  jade: function (string) { return jade(string)(); },
  markdown: function (string) { return markdown(string); },
  md: function (string) { return markdown(string); }
};
