var core, options, html2text = require( 'html-to-text');

module.exports = function ( _core, _options ) {
  core    = _core;
  options = _options;

  return {
    post     : postRouteGenerator,
    page     : pageRouteGenerator,
    tag      : tagRouteGenerator,
    category : categoryRouteGenerator,
    rss      : rssRouteGenerator
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

function rssRouteGenerator ( view ) {
  return function rssRoute ( req, res, next ) {
    var posts = core.getPosts(0, 5);

    // Since the preview is automatically generated for the examples,
    // it contains markup. Strip out the markup with the html-to-text
    // module. Or you can specify your own specific rss description
    // per post
    posts.forEach(function (post) {
      post.rssDescription = html2text.fromString(post.preview);
    });

    res.render( view, { posts: posts });
  }
}
