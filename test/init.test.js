var
  express = require( 'express' ),
  chai    = require( 'chai' ),
  should  = chai.should(),
  expect  = chai.expect;

describe( 'Init', function () {
  it( 'should pass in core functions to init callback', function ( done ) {
    var
      app = express.createServer(),
      poet = require( '../lib/poet' )( app );

    poet.set({ posts: './test/_postsJson' }).init(function ( core ) {
      core.getPosts.should.exist;
      core.postList.should.have.length(5);
      core.tagList.should.have.length(4);
      done();
    });
  });
});
