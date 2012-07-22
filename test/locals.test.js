var
  express = require( 'express' ),
  chai    = require( 'chai' ),
  should  = chai.should(),
  expect  = chai.expect;

describe( 'Locals', function () {
  it( 'should pass in the locals for the view', function ( done ) {
    var
      app = express.createServer(),
      poet = require( '../lib/poet' )( app );

    poet.set({ posts: './test/_postsYaml', metaFormat: 'yaml' }).init(function () {
      app._locals.postCount.should.equal(3);
      app._locals.allPosts.should.have.length(3);
      app._locals.allTags.should.include('a');
      app._locals.allTags.should.include('b');
      app._locals.allTags.should.include('c');
      app._locals.allTags.should.include('d');
      app._locals.allCategories.should.include('testing');
      app._locals.allCategories.should.include('other cat');
      app._locals.pageUrl(3).should.equal('/posts/3');
      app._locals.tagUrl('sometag').should.equal('/tag/sometag');
      app._locals.categoryUrl('somecat').should.equal('/category/somecat');
      app._locals.getPosts(2,3).should.have.length(1);
      app._locals.pageCount.should.equal(1);
      done();
    });
  });
});
