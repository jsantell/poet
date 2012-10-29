var
  fs       = require( 'fs' ),
  yamlFm   = require( 'front-matter' ),
  jsonFm   = require( 'json-front-matter' ).parse,
  templates = require( './poet/templates' ),
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
    readMoreLink : function ( post ) {
      var anchor = '<a href="'+post.url+'" title="Read more of '+post.title+'">read more</a>';
      return '<p>' + anchor + '</p>';
    },
    readMoreTag  : '<!--more-->',
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

function addTemplate ( o ) {
  if ( !o.ext || !o.fn ) {
    throw new Error( 'Template must have both an extension and formatter function' );
  }

  if ( !Array.isArray( o.ext ) ) {
    o.ext = [ o.ext ];
  }

  templates[ o.ext[0] ] = {
    ext : o.ext,
    fn  : o.fn
  };

  return exports;
}

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

function getTemplateFor ( filename ) {
  var templateFn, exts;
  Object.keys( templates ).forEach(function ( t ) {
    exts = Array.isArray( templates[ t ].ext ) ? templates[ t ].ext : [ templates[ t ].ext ];
    exts.forEach(function ( ext ) {
      if ( filename.match( new RegExp( '\\.' + ext + '$' ))) {
        templateFn = templates[ t ].fn;
      }
    });
  });
  return templateFn;
}

exports.addTemplate         = addTemplate;
exports.createPostRoute     = createRoute( 'post' );
exports.createPageRoute     = createRoute( 'page' );
exports.createTagRoute      = createRoute( 'tag' );
exports.createCategoryRoute = createRoute( 'category' );
exports.middleware          = returnMiddleware;
exports.init = init;
