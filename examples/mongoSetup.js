var
  express = require('express'),
  app = express();

var poet = require('../lib/poet')(app, {
  storageType: 'database',
  mongoUri: 'mongodb://poet-demo:poet-demo@oceanic.mongohq.com:10072/poet_mongo_demo',
  dbRefreshInterval: 60000,
});

poet.watch(function () {
  // watcher reloaded
}).init().then(function () {
  // Ready to go!
});

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(app.router);

app.get('/', function (req, res) { res.render('index'); });

app.listen(3000);

