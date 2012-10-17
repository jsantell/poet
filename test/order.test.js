var
  express = require( 'express' ),
  chai    = require( 'chai' ),
  should  = chai.should(),
  expect  = chai.expect;

describe( 'core.postWithTag()', function () {
  it( 'should return posts ordered by date, newest first', function ( done ) {
    var
      app = express.createServer(),
      poet = require( '../lib/poet' )( app );

    poet.set({ posts: './test/_postsJson' }).init(function ( core ) {
      var posts = core.postsWithTag('a');
      
      (posts[0].date.getTime() > posts[1].date.getTime()).should.equal(true);
      (posts[1].date.getTime() > posts[2].date.getTime()).should.equal(true);
      
      done();
    });
  });
});

describe( 'core.postWithCategories()', function () {
  it( 'should return posts ordered by date, newest first', function ( done ) {
    var
      app = express.createServer(),
      poet = require( '../lib/poet' )( app );

    poet.set({ posts: './test/_postsJson' }).init(function ( core ) {
      var posts = core.postsWithCategory('testing');
      
      (posts[0].date.getTime() > posts[1].date.getTime()).should.equal(true);
      (posts[1].date.getTime() > posts[2].date.getTime()).should.equal(true);
      
      done();
    });
  });
});
