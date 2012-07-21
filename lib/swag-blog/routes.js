var options, s;

module.exports = function ( _options, _storage ) {
  options   = _options;
  s = _storage;
  return {
    post     : postRouteGenerator,
    postList : postListRouteGenerator,
    tag      : tagRouteGenerator,
    category : categoryRouteGenerator
  }
};

function postRouteGenerator ( view ) {
  return function postRoute ( req, res, next ) {
    console.log('boop');
    return;
    var post = req.params.post;
    if ( s.posts[ post ] ) {
      res.render( view, { post: s.posts[ post ] });
    } else {
      next();
    }
  };
}

function postListRouteGenerator ( view ) {
  return function postListRoute ( req, res, next ) {
    var
      page = req.params.page,
      lastPost = page * options.postsPerPage;
    res.render( view, {
      posts : s.orderedPosts.slice( lastPost - options.postsPerPage, lastPost ),
      page  : page
    });
  }
}

function categoryRouteGenerator ( view ) {
  return function categoryRoute ( req, res, next ) {
    var cat = req.params.category;
    if ( ~s.categories.indexOf( cat )) {
      res.render( view, {
        posts    : fnPostsCategorized( cat ),
        category : cat
      });
    } else {
      next();
    }
  };
}

function tagRouteGenerator ( view ) {
  return function tagRoute ( req, res, next ) {
    var tag = req.params.tag;
    if ( ~s.tags.indexOf( tag ) ) {
      res.render( view, {
        posts : fnPostsTagged( tag ),
        tag   : tag
      });
    } else {
      next();
    }
  };
}


function fnPostsTagged ( tag ) {
  if ( s.postsTagged[ tag ] ) return s.postsTagged[ tag ];
  var ret = [];
  for ( var p in s.posts ) {
    if ( !s.posts[ p ].tags ) continue;
    if ( ~s.posts[ p ].tags.indexOf( tag )) ret.push( s.posts[ p ] );
  }
  return s.postsTagged[ tag ] = ret;
}

function fnPostsCategorized ( cat ) {
  if ( s.postsCategorized[ cat ] ) return s.postsCategorized[ cat ];
  var ret = [];
  for ( var p in s.posts ) {
    if ( !s.posts[ p ].category ) continue;
    if ( s.posts[ p ].category.toLowerCase() === cat.toLowerCase()) {
      ret.push( s.posts[ p ] );
    }
  }
  return s.postsCategorized[ cat ] = ret;
}
