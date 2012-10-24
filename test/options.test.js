var
  express = require( 'express' ),
  chai    = require( 'chai' ),
  should  = chai.should(),
  expect  = chai.expect;

var
  readMoreLink = '<a href="/post/test2">Test Post Two</a>';

describe( 'Options', function () {
  describe( 'readMore', function () {
    it( 'should be a function that returns markup appended to the preview', function ( done ) {
      var
        app = express.createServer(),
        poet = require( '../lib/poet' )( app );

      poet.set({
        posts: './test/_postsJson',
        readMore: function ( post ) {
          return '<a href="'+post.url+'">'+post.title+'</a>';
        }
      }).init(function ( core ) {
        var posts = app._locals.postList;
        posts[0].preview.should.equal( '<p><em>some content</em></p>' + readMoreLink );
        done();
      });
    });
  });
});
