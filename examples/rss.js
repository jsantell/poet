var
  express   = require( 'express' ),
  app       = express(),
  poet      = require( '../lib/poet' )( app );

// All default options, but shown for example

poet
  .createPostRoute()
  .createPageRoute()
  .createTagRoute()
  .createCategoryRoute()
  .init(setupRss);

app.set( 'view engine', 'jade' );
app.set( 'views', __dirname + '/views' );
app.use( express.static( __dirname + '/public' ));
app.use( app.router );
app.locals.pretty = true;

app.get( '/', function ( req, res ) { res.render( 'index' ); });

app.listen( 3000 );

function setupRss ( core ) {
  app.get('/rss', function ( req, res ) {
    var posts = core.getPosts(0, core.getPostCount());
    
    posts.forEach(function (post) {
      post.rssDescription = (post.rssPreview);
    });

    res.render( 'rss', { posts: posts });
  });
}
