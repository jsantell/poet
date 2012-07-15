module.exports = function ( app, options, storage ) {
  var utils = require( './utils' );
  return function () {
    app.locals({
      postCount     : storage.orderedPosts.length,
      allPosts      : storage.orderedPosts,
      allTags       : storage.tags,
      allCategories : storage.categories,
      pageUrl       : function ( page ) {
        return utils.stripRouteParams( options.routes.postList ) + page;
      },
      tagUrl        : function ( tag ) {
        return utils.stripRouteParams( options.routes.tag ) + tag;
      },
      categoryUrl   : function ( cat ) {
        return utils.stripRouteParams( options.routes.category ) + cat;
      },
      getPosts      : function ( from, to ) {
        return storage.orderedPosts.slice( from, to );
      },
      pageCount     : Math.ceil( storage.orderedPosts.length / options.postsPerPage )
    });
  };
}
