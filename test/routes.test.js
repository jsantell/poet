var
  express = require( 'express' ),
  chai    = require( 'chai' ),
  should  = chai.should(),
  expect  = chai.expect,
  routes  = require( '../lib/poet/routes' )(),
  reqMock = require( './helpers/routeMocks' ).req,
  resMock = require( './helpers/routeMocks' ).res;

describe( 'Routes', function () {
  it( 'should make the correct auto routes by default', function ( done ) {
    var
      app = express.createServer(),
      poet = require( '../lib/poet' )( app );

    poet.set({ posts: './test/_postsJson', metaFormat: 'json' })
      .createPostRoute()
      .createPageRoute()
      .createTagRoute()
      .createCategoryRoute()
      .init(function () {
        app.lookup.get('/post/:post')[0].callbacks[0]
          .toString().should.equal( routes.post().toString() );
        app.lookup.get('/page/:page')[0].callbacks[0]
          .toString().should.equal( routes.page().toString() );
        app.lookup.get('/tag/:tag')[0].callbacks[0]
          .toString().should.equal( routes.tag().toString() );
        app.lookup.get('/category/:category')[0].callbacks[0]
          .toString().should.equal( routes.category().toString() );
        done();
      });
  });

  it( 'should use the default views', function ( done ) {
    var
      app = express.createServer(),
      poet = require( '../lib/poet' )( app ),
      reqPost = reqMock({ post: 'test1'}),
      reqPage = reqMock({ page: 1}),
      reqTag = reqMock({ tag: 'a'}),
      reqCategory = reqMock({ category: 'testing' }),
      resPost = resMock(function () {
        resPost.viewName.should.equal('post');
        checkDone();
      }),
      resPage = resMock(function () {
        resPage.viewName.should.equal('page');
        checkDone();
      }),
      resTag = resMock(function () {
        resTag.viewName.should.equal('tag');
        checkDone();
      }),
      resCategory = resMock(function () {
        resCategory.viewName.should.equal('category');
        checkDone();
      });

    var checkDone = (function () {
      var count = 0;
      return function () {
        if ( ++count === 4 ) { done(); }
      };
    })();

    poet.set({ posts: './test/_postsJson', metaFormat: 'json' })
      .createPostRoute()
      .createPageRoute()
      .createTagRoute()
      .createCategoryRoute()
        .init(function () {
        app.lookup.get('/post/:post')[0].callbacks[0]( reqPost, resPost );
        app.lookup.get('/page/:page')[0].callbacks[0]( reqPage, resPage );
        app.lookup.get('/tag/:tag')[0].callbacks[0]( reqTag, resTag );
        app.lookup.get('/category/:category')[0].callbacks[0]( reqCategory, resCategory );
      });
  });

  it( 'should allow configurable routes in the generator', function ( done ) {
    var
      app = express.createServer(),
      poet = require( '../lib/poet' )( app );

    poet.set({ posts: './test/_postsJson', metaFormat: 'json' })
      .createPostRoute( '/myposts/:post', 'post' )
      .createPageRoute( '/pagesss/:page', 'page' )
      .createTagRoute( '/mytags/:tag', 'tag' )
      .createCategoryRoute( '/mycats/:category', 'category' )
      .init(function () {
        app.lookup.get('/myposts/:post')[0].callbacks[0]
          .toString().should.equal( routes.post().toString() );
        app.lookup.get('/pagesss/:page')[0].callbacks[0]
          .toString().should.equal( routes.page().toString() );
        app.lookup.get('/mytags/:tag')[0].callbacks[0]
          .toString().should.equal( routes.tag().toString() );
        app.lookup.get('/mycats/:category')[0].callbacks[0]
          .toString().should.equal( routes.category().toString() );
        done();
      });
  });
  
  it( 'should use configurable views', function ( done ) {
    var
      app = express.createServer(),
      poet = require( '../lib/poet' )( app ),
      reqPost = reqMock({ post: 'test1'}),
      reqPage = reqMock({ page: 1}),
      reqTag = reqMock({ tag: 'a'}),
      reqCategory = reqMock({ category: 'testing' }),
      resPost = resMock(function () {
        resPost.viewName.should.equal('postView');
        checkDone();
      }),
      resPage = resMock(function () {
        resPage.viewName.should.equal('pageView');
        checkDone();
      }),
      resTag = resMock(function () {
        resTag.viewName.should.equal('tagView');
        checkDone();
      }),
      resCategory = resMock(function () {
        resCategory.viewName.should.equal('categoryView');
        checkDone();
      });

    var checkDone = (function () {
      var count = 0;
      return function () {
        if ( ++count === 4 ) { done(); }
      };
    })();

    poet.set({ posts: './test/_postsJson', metaFormat: 'json' })
      .createPostRoute( '/myposts/:post', 'postView' )
      .createPageRoute( '/postlist/:page', 'pageView' )
      .createTagRoute( '/mytags/:tag', 'tagView' )
      .createCategoryRoute( '/mycats/:category', 'categoryView' )
      .init(function () {
        app.lookup.get('/myposts/:post')[0].callbacks[0]( reqPost, resPost );
        app.lookup.get('/postlist/:page')[0].callbacks[0]( reqPage, resPage );
        app.lookup.get('/mytags/:tag')[0].callbacks[0]( reqTag, resTag );
        app.lookup.get('/mycats/:category')[0].callbacks[0]( reqCategory, resCategory );
      });
  });
});
