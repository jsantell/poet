module.exports = function ( app, options, container ) {
  
  var
    posts            = container.posts,
    tags             = container.tags,
    categories       = container.categories,
    orderedPosts = container.orderedPosts,
    postsTagged      = container.postsTagged,
    postsCategorized = container.postsCategorized,
    paginationRegex  = new RegExp( '\\\/' + options.postListRoute.match(/^\/(.*)\/$/)[1] + '\\\/([0-9]*)' );

  app.get( paginationRegex, pageRoute );
  app.get( options.postRoute + ':slug', postRoute );
  app.get( options.categoryRoute + ':category', categoryRoute );
  app.get( options.tagRoute + ':tag', tagRoute );

  function pageRoute ( req, res, next ) {
    var
      page = req.params[0],
      lastPost = page * options.postsPerPage;
    res.render( options.postListView, {
      posts : orderedPosts.slice( lastPost - options.postsPerPage, lastPost ),
      page  : page
    });
  }

  function postRoute ( req, res, next ) {
    var slug = req.params.slug;
    if ( posts[ slug ] ) {
      res.render( options.postView, { post: posts[ slug ] });
    } else {
      next();
    }
  }

  function categoryRoute ( req, res, next ) {
    var cat = req.params.category;
    if ( ~categories.indexOf( cat )) {
      res.render( options.categoryView, {
        posts    : fnPostsCategorized( cat ),
        category : cat
      });
    } else {
      next();
    }
  }

  function tagRoute ( req, res, next ) {
    var tag = req.params.tag;
    if ( ~tags.indexOf( tag ) ) {
      res.render( options.tagView, {
        posts : fnPostsTagged( tag ),
        tag   : tag
      });
    } else {
      next();
    }
  }

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
};
