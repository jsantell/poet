var
  _ = require('underscore'),
  markdown = require('marked'),
  renderer = new markdown.Renderer(),
  pug = require('pug').compile;

renderer.heading = function(text, level) {
  return '<h' + level + '>' + text + '</h' + level + '>\n';
};

// Configure defaults for marked to keep compatibility
markdown.setOptions({
  renderer: renderer,
  sanitize: false,
  pedantic: true
});

module.exports = {
  templates: {
    pug: function (options) { return pug(options.source, {filename: options.filename})(options.locals); },
    markdown: function (options) { return markdown(options.source); },
    md: function (options) { return markdown(options.source); }
  },
  templateEngines: {
    marked: markdown,
    pug: pug
  }
};