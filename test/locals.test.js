var
  express = require( 'express' ),
  chai    = require( 'chai' ),
  should  = chai.should(),
  expect  = chai.expect;

describe( 'Locals', function () {
  it( 'should pass in the locals for the view', function ( done ) {
    var
      app = express(),
      poet = require( '../lib/poet' )( app );

    poet.set({ 
      posts: './test/_postsYaml',
      metaFormat: 'yaml',
      showDrafts: true
    }).init(function () {
      app.locals.getPostCount().should.equal(4);
      app.locals.postList.should.have.length(4);
      app.locals.tagList.should.include('a');
      app.locals.tagList.should.include('b');
      app.locals.tagList.should.include('c');
      app.locals.tagList.should.include('d');
      app.locals.categoryList.should.include('testing');
      app.locals.categoryList.should.include('other cat');
      app.locals.pageUrl(3).should.equal('/page/3');
      app.locals.tagUrl('sometag').should.equal('/tag/sometag');
      app.locals.categoryUrl('somecat').should.equal('/category/somecat');
      app.locals.getPosts(2,3).should.have.length(1);
      app.locals.getPageCount().should.equal(1);
      done();
    });
  });
});
