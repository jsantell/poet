var core, options;

module.exports = function ( _core, _options ) {
  core    = _core;
  options = _options;

  return {
    post     : postRouteGenerator,
    page     : pageRouteGenerator,
    tag      : tagRouteGenerator,
    category : categoryRouteGenerator
  }
};

function postRouteGenerator ( view ) {
  return function postRoute ( req, res, next ) {
    var post = core.getPost( req.params.post );
    if ( post ) {
      res.render( view, { post: post });
    } else {
      next();
    }
  };
}

function pageRouteGenerator ( view ) {
  return function pageRoute ( req, res, next ) {
    var
      page = req.params.page,
      lastPost = page * options.postsPerPage;
    res.render( view, {
      posts : core.getPosts( lastPost - options.postsPerPage, lastPost ),
      page  : page
    });
  }
}

function categoryRouteGenerator ( view ) {
  return function categoryRoute ( req, res, next ) {
    var
      cat   = req.params.category,
      posts = core.postsWithCategory( cat );
    if ( posts.length ) {
      res.render( view, {
        posts    : posts,
        category : cat
      });
    } else {
      next();
    }
  };
}

function tagRouteGenerator ( view ) {
  return function tagRoute ( req, res, next ) {
    var
      tag   = req.params.tag,
      posts = core.postsWithTag( tag );
    if ( posts.length ) {
      res.render( view, {
        posts : posts,
        tag   : tag
      });
    } else {
      next();
    }
  };
};
