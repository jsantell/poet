var
  fs = require('fs'),
  yamlFm = require('front-matter'),
  jsonFm = require('json-front-matter').parse,
  _ = require('underscore'),
  defaultTemplates = require('./poet/templates'),
  defaultOptions = require('./poet/defaults'),
  methods = require('./poet/methods'),
  utils = require('./poet/utils');
  app, storage, options;

var core, locals, routeFns, refs, utils;

function Poet (app) {
  this.app = app;
  this.options = _.extend({}, defaultOptions);
  this.templates = _.extend({}, defaultTemplates);
  storage = {
    posts            : {},
    tags             : [],
    postsTagged      : {},
    categories       : [],
    postsCategorized : {},
    orderedPosts     : []
  };

  app        = _app;
  core       = require( './poet/core' )( options, storage );
  locals     = require( './poet/locals' )( app, core );
  routeFns   = require( './poet/routes' )( core, options );
  refs       = require( './poet/references' )( options, storage );
  utils      = require( './poet/utils' );
}

module.exports = function (app) {
  return new Poet(app);
};

Poet.prototype.set = method(methods.set);
Poet.prototype.addTemplate = method(methods.addTemplate);

function returnMiddleware () {
  return require( './poet/middleware' )( core );
}

function createRoute ( type ) {
  return function routeGenerator( _route, _view ) {
    options.routes[ type ] = _route = _route || options.routes[ type ];
    app.get( _route, routeFns[ type ]( _view || type ) );
    return exports;
  }
}

function init ( callback ) {
  fs.readdir( options.posts, function ( err, files ) {
    if ( err ) throw err;
    var totalFiles = files.length;
    files.forEach(function ( file ) {
      var template = getTemplateFor( file );

      // If no templates match file extension, ignore file
      if ( !template ) { totalFiles--; return; }

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

function saveData ( err, data, file, template, callback ) {
  var
    t = options.metaFormat( data ),
    body = t.body,
    attributes = t.attributes,
    fileName = file.replace( /\.[^\.]*$/, '' ),
    post = storage.posts[ fileName ] = {},
    lengthDefinedPreview,
    readMoreDefinedPreview;
  Object.keys( attributes ).forEach(function ( p ) {
    if ( p === 'date' )
      post[ p ] = new Date( attributes[ p ] );
    else
      post[ p ] = attributes[ p ];
  });
  if ( !post.date ) {
    post.date = new Date();
  }
  post.content = template( body );
  post.slug = fileName;
  post.url = options.routes.post.match( /[^\:]*/ )[0] + fileName;
  post.preview = template( utils.getPreview( post, body, options ) );
  post.preview += options.readMoreLink( post );
  callback();
}

function getTemplateFor (poet, filename) {
  var extMatch = filename.match(/\.(.*)$/);
  if (extMatch && extMatch.length > 1)
    return poet.templates[extMatch[1]];
}

exports.addTemplate         = addTemplate;
exports.createPostRoute     = createRoute( 'post' );
exports.createPageRoute     = createRoute( 'page' );
exports.createTagRoute      = createRoute( 'tag' );
exports.createCategoryRoute = createRoute( 'category' );
exports.middleware          = returnMiddleware;
exports.init = init;
