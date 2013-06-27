var
  jsonFm = require('json-front-matter').parse;

function readMoreLink (post) {
  var anchor = '<a href="' + post.url + '"';
  anchor += ' title="Read more of ' + post.title + '">read more</a>';
  return '<p>' + anchor + '</p>';
}

module.exports = {
  postsPerPage: 5,
  posts: './_posts/',
  showDrafts: process.env.NODE_ENV !== 'production',
  metaFormat: jsonFm,
  readMoreLink: readMoreLink,
  readMoreTag: '<!--more-->',
  routes: {
    post: '/post/:post',
    page: '/page/:page',
    tag: '/tag/:tag',
    category: '/category/:category'
  }
};
