var options, storage, utils;

module.exports = function ( _options, _storage ) {
  options = _options;
  storage = _storage;
  utils   = require( './utils' );
  return {

    // Posts

    postList     : storage.orderedPosts,
    getPostCount : getPostCount,
    getPost      : getPost,
    getPosts     : getPosts,


    // Tags

    tagList      : storage.tags,
    postsWithTag : postsWithTag,
    tagUrl       : tagUrl,


    // Categories

    categoryList      : storage.categories,
    postsWithCategory : postsWithCategory,
    categoryUrl       : categoryUrl,


    // Pages

    getPageCount : getPageCount,
    pageUrl      : pageUrl
  };
};

function getPostCount () {
  return storage.orderedPosts.length;
}

function getPost ( title ) {
  return storage.posts[ title ];
}

function getPosts ( from, to ) {
  return storage.orderedPosts.slice( from, to );
}

function tagUrl ( tag ) {
  return utils.stripRouteParams( options.routes.tag) + tag;
}

function categoryUrl ( cat ) {
  return utils.stripRouteParams( options.routes.category ) + cat;
}

function pageUrl ( page ) {
  return utils.stripRouteParams( options.routes.page ) + page;
}

function getPageCount () {
  return Math.ceil( storage.orderedPosts.length / options.postsPerPage );
}

function postsWithTag ( tag ) {
  if ( storage.postsTagged[ tag ] ) return storage.postsTagged[ tag ];

  var ret = [];
  storage.orderedPosts.forEach(function(p) {
    if (p.tags && ~p.tags.indexOf( tag )) {
      ret.push( p );
    }
  });

  return storage.postsTagged[ tag ] = ret;
}

function postsWithCategory ( cat ) {
  if ( storage.postsCategorized[ cat ] ) return storage.postsCategorized[ cat ];

  var ret = [];
  storage.orderedPosts.forEach(function(p) {
    if ( p.category && p.category.toLowerCase() === cat.toLowerCase() ) {
      ret.push( p );
    }
  });

  return storage.postsCategorized[ cat ] = ret;
}
