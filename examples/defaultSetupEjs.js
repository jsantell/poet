var
  express = require('express'),
  app = express(),
  // All default options
  poet = require('../lib/poet')(app);

poet.init().then(function () {
  // initialized
});

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views/ejs');
app.use(express.static(__dirname + '/public'));
app.use(app.router);

app.get('/', function (req, res) { res.render('index'); });

app.listen(3000);
