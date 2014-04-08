var
  _ = require('underscore');

function readMoreLink (post) {
 /* if no "read more" is wanted in the post 
  * set "previewLength" equal to sentinel value of 314159 
  * (can be made different) and actual post in a list of 
  * posts won't show link to the whole post 
  */
  if(post.previewLength == 314159){
    return '<p></p>';
  } 

  var anchor = '<a href="' + post.url + '"';
  anchor += ' title="Read more of ' + post.title + '">read more</a>';
  return '<p>' + anchor + '</p>';
}

/**
 * Returns a fresh copy of default options
 *
 * @returns {Object}
 */

function createDefaults () {
 return {
    postsPerPage: 5,
    posts: './_posts/',
    showDrafts: process.env.NODE_ENV !== 'production',
    showFuture: process.env.NODE_ENV !== 'production',
    metaFormat: 'json',
    readMoreLink: readMoreLink,
    readMoreTag: '<!--more-->',
    routes: {
      '/post/:post': 'post',
      '/page/:page': 'page',
      '/tag/:tag': 'tag',
      '/category/:category': 'category'
    }
  };
}
module.exports = createDefaults;
