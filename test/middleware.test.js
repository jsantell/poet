var
  express = require( 'express' ),
  chai    = require( 'chai' ),
  should  = chai.should(),
  expect  = chai.expect,
  reqMock = require( './helpers/routeMocks' ).req,
  resMock = require( './helpers/routeMocks' ).res,
  request = require( 'supertest' );

describe( 'Routes', function () {
  it( 'should add the appropriate objects to the request object', function ( done ) {
    var
      app = express.createServer(),
      poet = require( '../lib/poet' )( app );

    poet.set({ posts: './test/_postsJson', metaFormat: 'json' }).init(function () {
      // Test a few properties of response
      request( app ).get( '/' ).expect({
        postCount : 3,
        allTags : [ 'a', 'b', 'c', 'd' ],
        pageCount : 1,
        allCategories : [ 'testing', 'other cat' ]
      }, done );
    });
    
    app.configure(function () {
      app.use( poet.middleware() );
      app.use( app.router );
    });

    app.get( '/', function ( req, res ) {
      res.send({
        postCount : req.poet.postCount,
        allTags   : req.poet.allTags,
        pageCount : req.poet.pageCount,
        allCategories : req.poet.allCategories
      });
    });
  });
});
