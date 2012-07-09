module.exports = function ( app, options ) {

  var
    fs = require( 'fs' ),
    md = require( 'node-markdown' ).Markdown,
    yamlFm = require( 'front-matter' ),
    jsonFm = require( 'json-front-matter' );

  options = {
    postsPerPage : options.postsPerPage || 2,
    posts        : options.posts ? appendSlash( options.posts ) : './_posts/',
    fm           : options.metaFormat === 'yaml' ? yamlFm : jsonFm.parse,

    postView     : options.postView      || 'post',
    postListView : options.postListView  || 'list',
    tagView      : options.tagView       || 'tag',
    categoryView : options.categoryView  || 'category',

    postRoute     : appendSlash( options.postRoute     || '/post/' ),
    postListRoute : appendSlash( options.postListRoute || '/posts/' ),
    tagRoute      : appendSlash( options.tagRoute      || '/tag/' ),
    categoryRoute : appendSlash( options.categoryRoute || '/category/' )
  };

  // Post data
  var
    posts       = {},
    tags        = [],
    postsTagged = {},
    categories  = [],
    postsCategorized = {},
    orderedPosts = [];

  var varObj = {
    posts            : posts,
    tags             : tags,
    categories       : categories,
    postsTagged      : postsTagged,
    postsCategorized : postsCategorized,
    orderedPosts : orderedPosts
  };

  // View variables
  var helperObj = {
  };

  postsToMem( options.posts );


  /*
   * Dynamic Routes
   */

  require( './swag-blog/routes' )( app, options, varObj );


  /*
   * Store posts in memory
   */

  function postsToMem( postDir ) {
    fs.readdir( postDir, function ( err, files ) {
      if ( err ) throw err;
      var totalFiles = files.length;
      files.forEach(function ( file ) {
        if ( !file.match( /\.md$/ ) ) { totalFiles--; return; }
        fs.readFile( postDir + file, 'utf-8', function ( err, data ) {
          var
            t = options.fm( data ),
            fileName = file.replace( /\.md$/, '' );
          posts[ fileName ] = {};
          for ( var p in t.attributes ) {
            if ( t.attributes.hasOwnProperty( p ) ) {
              if ( p === 'date' )
                posts[ fileName ][ p ] = new Date( t.attributes[ p ] );
              else
                posts[ fileName ][ p ] = t.attributes[ p ];
            }
          }
          if ( !posts[ fileName ].date ) {
            posts[ fileName ].date = new Date();
          }
          posts[ fileName ].content = md( t.body, true );
          posts[ fileName ].preview = md( t.body.replace(/\n.*/g, ''), true );
          posts[ fileName ].url = options.postRoute + fileName;
          !--totalFiles && setupReferences();
        });
      });
    });
  }


  /*
   * Setup internal storage and helpers
   */

  function setupReferences () {
    buildOrderedPosts();
    buildTags();
    buildCategories();
    app.helpers({
      postCount     : orderedPosts.length,
      allPosts      : orderedPosts,
      allTags       : tags,
      allCategories : categories,
      pageUrl       : function ( page ) { return options.postListRoute + page; },
      tagUrl        : function ( tag ) { return options.tagRoute + tag; },
      categoryUrl   : function ( cat ) { return options.categoryRoute + cat; },
      getPosts      : function ( from, to ) { return orderedPosts.slice( from, to ); },
      pageCount     : Math.ceil( orderedPosts.length / options.postsPerPage )
    });
  }

  function buildOrderedPosts () {
    for ( var p in posts ) {
      orderedPosts.push( posts[ p ] );
    }
    orderedPosts.sort(function( a, b ) {
      if ( a.date < b.date ) return -1;
      if ( a.date > b.date ) return 1;
      return 0;
    });
    return orderedPosts;
  }

  function buildTags () {
    for ( var p in posts ) {
      if ( posts[ p ].tags ) {
        posts[ p ].tags.forEach(function ( tag ) {
          if ( !~tags.indexOf( tag )) tags.push( tag );
        });
      }
    }
  }

  function buildCategories () {
    for ( var p in posts ) {
      if ( posts[ p ].category ) {
        if ( !~categories.indexOf( posts[ p ].category )) {
          categories.push( posts[ p ].category );
        }
      }
    }
  }


  /*
   * Utilities
   */

  function appendSlash ( s ) {
    if ( s.charAt( s.length - 1 ) !== '/' ) {
      s += '/';
    }
    return s;
  }

};

