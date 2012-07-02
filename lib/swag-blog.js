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
    dateOrderedPosts = [],
    paginationRegex = new RegExp( '\\\/' + options.postListRoute.match(/^\/(.*)\/$/)[1] + '\\\/([0-9]*)' );

  postsToMem( options.posts );


  /*
   * Routing
   */

  app.get( paginationRegex, function ( req, res, next ) {
    var
      page = req.params[0],
      lastPost = page * options.postsPerPage;
    res.render( options.postListView, {
      posts : dateOrderedPosts.slice( lastPost - options.postsPerPage, lastPost ),
      page  : page
    });
  });

  app.get( options.postRoute + ':slug', function ( req, res, next ) {
    var slug = req.params.slug;
    if ( posts[ slug ] ) {
      res.render( options.postView, { post: posts[ slug ] });
    } else {
      res.render( '404' );
    }
  });

  app.get( options.categoryRoute + ':category', function ( req, res, next ) {
    var cat = req.params.category;
    if ( ~categories.indexOf( cat )) {
      res.render( options.categoryView, {
        posts    : fnPostsCategorized( cat ),
        category : cat
      });
    } else {
      res.render( '404' );
    }
  });

  app.get( options.tagRoute + ':tag', function ( req, res, next ) {
    var tag = req.params.tag;
    if ( ~tags.indexOf( tag ) ) {
      res.render( options.tagView, {
        posts : fnPostsTagged( tag ),
        tag   : tag
      });
    } else {
      res.render( '404' );
    }
  });

  function fnPostsTagged ( tag ) {
    if ( postsTagged[ tag ] ) return postsTagged[ tag ];
    var ret = [];
    for ( var p in posts ) {
      if ( !posts[ p ].tags ) continue;
      if ( ~posts[ p ].tags.indexOf( tag )) ret.push( posts[ p ] );
    }
    return postsTagged[ tag ] = ret;
  }

  function fnPostsCategorized ( cat ) {
    if ( postsCategorized[ cat ] ) return postsCategorized[ cat ];
    var ret = [];
    for ( var p in posts ) {
      if ( !posts[ p ].category ) continue;
      if ( posts[ p ].category.toLowerCase() === cat.toLowerCase()) {
        ret.push( posts[ p ] );
      }
    }
    return postsCategorized[ cat ] = ret;
  }

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
      postCount     : dateOrderedPosts.length,
      allPosts      : dateOrderedPosts,
      allTags       : tags,
      allCategories : categories,
      pageUrl       : function ( page ) { return options.postListRoute + page; },
      tagUrl        : function ( tag ) { return options.tagRoute + tag; },
      categoryUrl   : function ( cat ) { return options.categoryRoute + cat; },
      getPosts      : function ( from, to ) { return dateOrderedPosts.slice( from, to ); },
      pageCount     : Math.ceil( dateOrderedPosts.length / options.postsPerPage )
    });
  }

  function buildOrderedPosts () {
    for ( var p in posts ) {
      dateOrderedPosts.push( posts[ p ] );
    }
    dateOrderedPosts.sort(function( a, b ) {
      if ( a.date < b.date ) return -1;
      if ( a.date > b.date ) return 1;
      return 0;
    });
    return dateOrderedPosts;
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

