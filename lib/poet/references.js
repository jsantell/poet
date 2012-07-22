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

  function buildTags () {
    for ( var p in storage.posts ) {
      if ( storage.posts[ p ].tags ) {
        storage.posts[ p ].tags.forEach(function ( tag ) {
          if ( !~storage.tags.indexOf( tag )) storage.tags.push( tag );
        });
      }
    }
  }

  function buildCategories () {
    for ( var p in storage.posts ) {
      if ( storage.posts[ p ].category ) {
        if ( !~storage.categories.indexOf( storage.posts[ p ].category )) {
          storage.categories.push( storage.posts[ p ].category );
        }
      }
    }
  }

  return function () {
    buildOrderedPosts();
    buildTags();
    buildCategories();
  };
};
