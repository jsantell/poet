var
  fs = require('fs'),
  _ = require('underscore'),
  createTemplates = require('./poet/templates'),
  methods = require('./poet/methods'),
  utils = require('./poet/utils'),
  method = utils.method;

function Poet (app, options) {
  this.app = app;
  this.options = utils.createOptions(options);
  this.templates = createTemplates();
  this.posts = {};
  
  app        = _app;
  core       = require( './poet/core' )( options, storage );
  locals     = require( './poet/locals' )( app, core );
  routeFns   = require( './poet/routes' )( core, options );
  refs       = require( './poet/references' )( options, storage );
  utils      = require( './poet/utils' );

  // Hack to work around and get tests passing before
  // decoupling is finished
  POET_INSTANCE = this;
}

module.exports = function (app) {
  return new Poet(app);
};

Poet.prototype.addTemplate = method(methods.addTemplate);
Poet.prototype.init = method(methods.init);
Poet.prototype.createPostRoute = method(createRoute('post'));
Poet.prototype.createPageRoute = method(createRoute('page'));
Poet.prototype.createTagRoute = method(createRoute('tag'));
Poet.prototype.createCategoryRoute = method(createRoute('category'));

function returnMiddleware () {
  return require( './poet/middleware' )( core );
}

function createRoute (poet, type) {
  return function routeGenerator(route, view) {
    poet.app.get(, routeFns[ type ]( _view || type ) );
    return POET_INSTANCE;
  }
}


Poet.prototype.middleware          = returnMiddleware;
