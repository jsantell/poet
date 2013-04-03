module.exports = function ( options, storage ) {
  
  function buildOrderedPosts () {
    for ( var p in storage.posts ) {
      storage.orderedPosts.push( storage.posts[ p ] );
    }
    storage.orderedPosts.sort(function( a, b ) {
      if ( a.date < b.date ) return 1;
      if ( a.date > b.date ) return -1;
      return 0;
    });
    return storage.orderedPosts;
  }

  function buildTagsAndCategories () {
    var post;
    for ( var p in storage.posts ) {
      post = storage.posts[ p ];
      if ( post.tags ) {
        post.tags.forEach(function ( tag ) {
          if ( !~storage.tags.indexOf( tag )) storage.tags.push( tag );
        });
      }
      if ( post.category && !~storage.categories.indexOf( post.category )) {
       storage.categories.push( post.category );
      }
    }
  }


  return function () {
    buildOrderedPosts();
    buildTagsAndCategories();
    storage.tags.sort();
    storage.categories.sort();
  };
};
