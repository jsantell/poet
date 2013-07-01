var
  fs = require('fs'),
  _ = require('underscore'),
  createTemplates = require('./poet/templates'),
  createHelpers = require('./poet/helpers'),
  bindRoutes = require('./poet/routes'),
  methods = require('./poet/methods'),
  utils = require('./poet/utils'),
  method = utils.method;

function Poet (app, options) {
  this.app = app;

  // Set up a hash of posts and a cache for storing sorted array
  // versions of posts, tags, and categories for the helper
  this.posts = {};
  this.cache = {};

  // Merge options with defaults
  this.options = utils.createOptions(options);

  // Set up default templates (markdown, jade)
  this.templates = createTemplates();

  // Construct helper methods
  this.helpers = createHelpers(this);

  // Bind locals for view access
  utils.createLocals(this.app, this.helpers);

  // Bind routes to express app based off of options
  bindRoutes(this);

  // On instantiation, fetch posts and construct internal
  // cache
  this.init();
}

module.exports = function (app) {
  return new Poet(app);
};

Poet.prototype.addTemplate = method(methods.addTemplate);
Poet.prototype.init = method(methods.init);
Poet.prototype.middleware = method(methods.middleware);
