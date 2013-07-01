var
  express = require('express'),
  app = express(),
  Poet = require('../lib/poet');

var poet = Poet(app, {
  postsPerPage: 3,
  posts: './_posts',
  metaFormat: 'json',
  routes: {
    '/myposts/:post': 'post',
    '/pagination/:page': 'page',
    '/mytags/:tag': 'tag',
    '/mycategories/:category': 'category'
  }
});

poet.init().then(function () {
  // initialized
});

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(app.routes);

app.get('/', function (req, res) { res.render('index');});

app.listen(3000);
