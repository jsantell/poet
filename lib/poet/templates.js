var
  _ = require('underscore'),
  markdown = require('marked'),
  renderer = new markdown.Renderer(),
  jade = require('jade').compile
  pigmentize = require('pygmentize-bundled');

renderer.heading = function(text, level) {
  return '<h' + level + '>' + text + '</h' + level + '>\n';
};

// Configure defaults for marked to keep compatibility
markdown.setOptions({
  renderer: renderer,
  sanitize: false,
  pedantic: true,
  highlight: function (code, lang, callback) {
    pigmentize({ lang: lang, format: 'html' }, code, function (err, result) {
      callback(err, result.toString());
    });
  }
});

module.exports = {
  templates: {
    jade: function (options) { return jade(options.source, {filename: options.filename})(options.locals); },
    markdown: function (options, callback) { return markdown(options.source, callback); },
    md: function (options, callback) { return markdown(options.source, callback); }
  },
  templateEngines: {
    marked: markdown,
    jade: jade
  }
};