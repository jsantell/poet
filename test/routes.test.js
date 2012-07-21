var
  express = require( 'express' ),
  chai    = require( 'chai' ),
  should  = chai.should(),
  expect  = chai.expect,
  routes  = require( '../lib/swag-blog/routes' )();

describe( 'Routes', function () {
  it( 'should make the correct auto routes by default', function ( done ) {
    var
      app = express.createServer(),
      swag = require( '../lib/swag-blog' )( app );

    swag.set({ posts: './test/_postsJson', metaFormat: 'json' })
      .createPostRoute()
      .createPostListRoute()
      .createTagRoute()
      .createCategoryRoute()
      .init(function () {
        app.lookup.get('/post/:post')[0].callbacks[0]
          .toString().should.equal( routes.post().toString() );
        app.lookup.get('/posts/:page')[0].callbacks[0]
          .toString().should.equal( routes.postList().toString() );
        app.lookup.get('/tag/:tag')[0].callbacks[0]
          .toString().should.equal( routes.tag().toString() );
        app.lookup.get('/category/:category')[0].callbacks[0]
          .toString().should.equal( routes.category().toString() );
        done();
      });
  });

  it( 'should allow configurable routes in the generator', function ( done ) {
    var
      app = express.createServer(),
      swag = require( '../lib/swag-blog' )( app );

    swag.set({ posts: './test/_postsJson', metaFormat: 'json' })
      .createPostRoute( '/myposts/:post', 'post' )
      .createPostListRoute( '/postlist/:page', 'postList' )
      .createTagRoute( '/mytags/:tag', 'tag' )
      .createCategoryRoute( '/mycats/:category', 'category' )
      .init(function () {
        app.lookup.get('/myposts/:post')[0].callbacks[0]
          .toString().should.equal( routes.post().toString() );
        app.lookup.get('/postlist/:page')[0].callbacks[0]
          .toString().should.equal( routes.postList().toString() );
        app.lookup.get('/mytags/:tag')[0].callbacks[0]
          .toString().should.equal( routes.tag().toString() );
        app.lookup.get('/mycats/:category')[0].callbacks[0]
          .toString().should.equal( routes.category().toString() );
        done();
      });
  });
});
