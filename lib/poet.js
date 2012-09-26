var
  fs       = require( 'fs' ),
  md       = require( 'node-markdown' ).Markdown,
  yamlFm   = require( 'front-matter' ),
  jsonFm   = require( 'json-front-matter' ).parse,
  app, storage, options;

var core, locals, routeFns, refs, utils;

module.exports = function poet ( _app ) {
  storage = {
    posts            : {},
    tags             : [],
    postsTagged      : {},
    categories       : [],
    postsCategorized : {},
    orderedPosts     : []
  };

  options = {
    postsPerPage : 5,
    posts        : './_posts/',
    metaFormat   : jsonFm,
    routes : {
      post     : '/post/:post',
      page     : '/page/:page',
      tag      : '/tag/:tag',
      category : '/category/:category'
    }
  };

  app        = _app;
  core       = require( './poet/core' )( options, storage );
  locals     = require( './poet/locals' )( app, core );
  routeFns   = require( './poet/routes' )( core, options );
  refs       = require( './poet/references' )( options, storage );
  utils      = require( './poet/utils' );
  return exports;
};

exports.set = function set ( o ) {
  Object.keys( o ).forEach(function ( k ) {
    var setting = o[ k ];
    if ( k === 'metaFormat' ) {
      setting = o[ k ] === 'yaml' ? yamlFm : jsonFm;
    }
    if ( k === 'posts' ) {
      setting = utils.appendSlash( o[ k ] );
    }
    options[ k ] = setting;
  });
  return exports;
};

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
      if ( !file.match( /\.md$/ ) ) { totalFiles--; return; }
      fs.readFile( options.posts + file, 'utf-8', function ( err, data ) {
        saveData( err, data, file, function () {
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

function saveData ( err, data, file, callback ) {
  var
    t = options.metaFormat( data ),
    fileName = file.replace( /\.md$/, '' ),
    post = storage.posts[ fileName ] = {};
  Object.keys( t.attributes ).forEach(function ( p ) {
    if ( p === 'date' )
      post[ p ] = new Date( t.attributes[ p ] );
    else
      post[ p ] = t.attributes[ p ];
  });
  if ( !post.date ) {
    post.date = new Date();
  }
  post.content = md( t.body );
  post.slug = fileName;
  post.url = options.routes.post.match( /[^\:]*/ )[0] + fileName;
  post.preview = md( post.preview || t.body.replace(/\n.*/g, ''));
  callback();
}

exports.createPostRoute     = createRoute( 'post' );
exports.createPageRoute = createRoute( 'page' );
exports.createTagRoute      = createRoute( 'tag' );
exports.createCategoryRoute = createRoute( 'category' );
exports.middleware          = returnMiddleware;
exports.init = init;
