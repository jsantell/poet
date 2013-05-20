var
  express = require( 'express' ),
  chai    = require( 'chai' ),
  should  = chai.should(),
  expect  = chai.expect,
  routes  = require( '../lib/poet/routes' )(),
  reqMock = require( './helpers/routeMocks' ).req,
  resMock = require( './helpers/routeMocks' ).res,
  routeInfo = require( './helpers/routeInfo' );

describe( 'Routes', function () {
  it( 'should make the correct auto routes by default', function ( done ) {
    var
      app = express(),
      poet = require( '../lib/poet' )( app );

    poet.set({ posts: './test/_postsJson', metaFormat: 'json' })
      .createPostRoute()
      .createPageRoute()
      .createTagRoute()
      .createCategoryRoute()
      .init(function () {
        routeInfo.getCallback( app, '/post/:post' )
          .toString().should.equal( routes.post().toString() );
        routeInfo.getCallback( app, '/page/:page' )
          .toString().should.equal( routes.page().toString() );
        routeInfo.getCallback( app, '/tag/:tag' )
          .toString().should.equal( routes.tag().toString() );
        routeInfo.getCallback( app, '/category/:category' )
          .toString().should.equal( routes.category().toString() );
        done();
      });
  });

  it( 'should use the default views', function ( done ) {
    var
      app = express(),
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
          routeInfo.getCallback( app, '/post/:post' )( reqPost, resPost );
          routeInfo.getCallback( app, '/page/:page' )( reqPage, resPage );
          routeInfo.getCallback( app, '/tag/:tag' )( reqTag, resTag );
          routeInfo.getCallback( app, '/category/:category' )( reqCategory, resCategory );
      });
  });

  it( 'should allow configurable routes in the generator', function ( done ) {
    var
      app = express(),
      poet = require( '../lib/poet' )( app );

    poet.set({ posts: './test/_postsJson', metaFormat: 'json' })
      .createPostRoute( '/myposts/:post', 'post' )
      .createPageRoute( '/pagesss/:page', 'page' )
      .createTagRoute( '/mytags/:tag', 'tag' )
      .createCategoryRoute( '/mycats/:category', 'category' )
      .init(function () {
        routeInfo.getCallback( app, '/myposts/:post' )
          .toString().should.equal( routes.post().toString() );
        routeInfo.getCallback( app, '/pagesss/:page' )
          .toString().should.equal( routes.page().toString() );
        routeInfo.getCallback( app, '/mytags/:tag' )
          .toString().should.equal( routes.tag().toString() );
        routeInfo.getCallback( app, '/mycats/:category' )
          .toString().should.equal( routes.category().toString() );
        done();
      });
  });
  
  it( 'should use configurable views', function ( done ) {
    var
      app = express(),
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
        routeInfo.getCallback( app, '/myposts/:post' )( reqPost, resPost );
        routeInfo.getCallback( app, '/postlist/:page' )( reqPage, resPage );
        routeInfo.getCallback( app, '/mytags/:tag' )( reqTag, resTag );
        routeInfo.getCallback( app, '/mycats/:category' )( reqCategory, resCategory );
      });
  });
});
