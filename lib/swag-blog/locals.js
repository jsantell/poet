module.exports = function ( app, options, storage ) {
  return function () {
    app.helpers({
      postCount     : storage.orderedPosts.length,
      allPosts      : storage.orderedPosts,
      allTags       : storage.tags,
      allCategories : storage.categories,
      pageUrl       : function ( page ) { return options.routes.postList + page; },
      tagUrl        : function ( tag ) { return options.routes.tag + tag; },
      categoryUrl   : function ( cat ) { return options.routes.category + cat; },
      getPosts      : function ( from, to ) { return storage.orderedPosts.slice( from, to ); },
      pageCount     : Math.ceil( storage.orderedPosts.length / options.postsPerPage )
    });
  };
}
