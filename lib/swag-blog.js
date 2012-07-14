var
  _this    = {},
  fs       = require( 'fs' ),
  md       = require( 'node-markdown' ).Markdown,
  yamlFm   = require( 'front-matter' ),
  jsonFm   = require( 'json-front-matter' );

var storage = {
  posts            : {},
  tags             : [],
  postsTagged      : {},
  categories       : [],
  postsCategorized : {},
  orderedPosts     : []
};

var options = {
  postsPerPage : 5,
  posts        : './_posts/',
  fm           : jsonFm.parse,
  routes : {
    post     : '/post/',
    postList : '/posts/',
    tag      : '/tag/',
    category : '/category/'
  }
};

var
  routeFns = require( './swag-blog/routes' )( options, storage ),
  refs     = require( './swag-blog/references' )( options, storage ),
  utils    = require( './swag-blog/utils' ),
  app, locals;


module.exports = function swag ( _app ) {
  app    = _app;
  locals = require( './swag-blog/locals' )( app, options, storage );
  return exports;
};

exports.set = function set ( o ) {
  Object.keys( o ).forEach(function ( k ) {
    var setting = o[ k ];
    if ( k === 'metaFormat' ) {
      setting = o[ k ] === 'yaml' ? yamlFm : jsonFm.parse;
    }
    if ( k === 'posts' ) {
      setting = utils.appendSlash( o[ k ] );
    }
    options[ k ] = setting;
  });
  return exports;
};

exports.createPostRoute     = createRoute( 'post' );
exports.createPostListRoute = createRoute( 'postList' );
exports.createTagRoute      = createRoute( 'tag' );
exports.createCategoryRoute = createRoute( 'category' );
exports.init = init;

function createRoute ( type ) {
  var
    view  = type,
    route = options.routes[ type ];

  return function routeGenerator( _route, _view ) {
    options.routes[ type ] = _route || options.routes[ type ];
    _route = type === 'postList' ?
      utils.paginationRegex( _route || route ) :
      utils.appendSlash( _route || route ) + ':' + type;
    app.get( _route, routeFns[ type ]( _view || type ) );
    return exports;
  }
}

function init () {
  fs.readdir( options.posts, function ( err, files ) {
    if ( err ) throw err;
    var totalFiles = files.length;
    files.forEach(function ( file ) {
      if ( !file.match( /\.md$/ ) ) { totalFiles--; return; }
      fs.readFile( options.posts + file, 'utf-8', function ( err, data ) {
        var
          t = options.fm( data ),
          fileName = file.replace( /\.md$/, '' );
        storage.posts[ fileName ] = {};
        for ( var p in t.attributes ) {
          if ( t.attributes.hasOwnProperty( p ) ) {
            if ( p === 'date' )
              storage.posts[ fileName ][ p ] = new Date( t.attributes[ p ] );
            else
              storage.posts[ fileName ][ p ] = t.attributes[ p ];
          }
        }
        if ( !storage.posts[ fileName ].date ) {
          storage.posts[ fileName ].date = new Date();
        }
        storage.posts[ fileName ].content = md( t.body, true );
        storage.posts[ fileName ].preview = md( t.body.replace(/\n.*/g, ''), true );
        storage.posts[ fileName ].url = options.routes.post + fileName;
        if ( !--totalFiles ) {
          refs();
          locals();
        }
      });
    });
  });
}

