var
  express = require( 'express' ),
  app = express(),
  Poet = require('../lib/poet');

/**
 * Instantiate and hook Poet into express; no defaults defined
 */
var poet = Poet(app);

/**
 * In this example, upon initialization, we can modify the posts,
 * like format the dates using a library, or modify titles.
 * We'll add some asterisks to the titles of all posts for fun.
 */
poet.init().then(function () {
  poet.clearCache();
  Object.keys(poet.posts).map(function (title) {
    var post = poet.posts[title];
    post.title = '***' + post.title;
  });
});

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

/**
 * Now we set up custom routes; based on the route (ex: '/post/:post'),
 * it'll override the default route for the same type and update
 * all appropriate helper methods
 */

poet.addRoute('/mypost/:post', function (req, res) {
  var post = poet.helpers.getPost(req.params.post);
  if (post) {
    res.render('post', { post: post }); 
  } else {
    res.send(404);
  }
});

poet.addRoute('/mytags/:tag', function (req, res) {
  var taggedPosts = poet.helpers.postsWithTag(req.params.tag);
  if (taggedPosts.length) {
    res.render('tag', {
      posts: taggedPosts,
      tag: req.params.tag
    });
  }
});

poet.addRoute('/mycategories/:category', function (req, res) {
  var categorizedPosts = poet.helpers.postsWithCategory(req.params.category);
  if (categorizedPosts.length) {
    res.render('category', {
      posts: categorizedPosts,
      category: req.params.category
    });
  }
});

poet.addRoute('/mypages/:page', function (req, res) {
  var page = req.params.page,
    lastPost = page * 3;
  res.render('page', {
    posts: poet.helpers.getPosts(lastPost - 3, lastPost),
    page: page
  });
});

app.get('/', function (req, res) { res.render('index'); });

app.listen(3000);
