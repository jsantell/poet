var
  express   = require( 'express' ),
  app       = express(),
  html2text = require( 'html-to-text'),
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
    var posts = core.getPosts(0, 5);
    
    // Since the preview is automatically generated for the examples,
    // it contains markup. Strip out the markup with the html-to-text
    // module. Or you can specify your own specific rss description
    // per post
    posts.forEach(function (post) {
      post.rssDescription = html2text.fromString(post.preview);
    });

    res.render( 'rss', { posts: posts });
  });
}
