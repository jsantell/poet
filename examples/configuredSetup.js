var
  express  = require( 'express' ),
  app      = module.exports = express.createServer(),
  poet     = require( '../lib/poet' )( app );

// All default options, but shown for example

poet.set({
  postsPerPage : 3,
  posts        : './_posts',
  metaFormat   : 'json'
}).createPostRoute( '/myposts/:post', 'post' )
  .createPageRoute( '/pagination/:page', 'page' )
  .createTagRoute( '/mytags/:tag', 'tag' )
  .createCategoryRoute( '/mycategories/:category', 'category' )
  .init();

app.configure(function () {
  app.set( 'view engine', 'jade' );
  app.set( 'views', __dirname + '/views' );
  app.use( express.static( __dirname + '/public' ));
  app.use( app.router );
});

app.get( '/', function ( req, res ) { res.render( 'index' ) });

app.listen( 3000 );
