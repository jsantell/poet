module.exports = function ( app, options, container ) {
  
  var
    posts            = container.posts,
    tags             = container.tags,
    categories       = container.categories,
    dateOrderedPosts = container.dateOrderedPosts,
    postsTagged      = container.postsTagged,
    postsCategorized = container.postsCategorized,
    paginationRegex  = new RegExp( '\\\/' + options.postListRoute.match(/^\/(.*)\/$/)[1] + '\\\/([0-9]*)' );
