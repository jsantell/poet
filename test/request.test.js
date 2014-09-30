var
  Poet = require('../lib/poet'),
  express = require('express'),
  http = require('./helpers/http'),
  util = require("util"),
  when = require("when");

function setupPoet(options) {
  var
    app = express(),
    poet = Poet(app, options);

  app.set('view engine', 'jade');
  app.set('views', __dirname + '/../examples/views');

  if (options.mount && options.mainApp)
    options.mainApp.use(options.mount, poet.app);
  else
    options.server.on('request', app);

  return poet.init();
}

describe('Server request', function () {

  var server;

  beforeEach(function(done) {
    http.setupServer()
      .then(function(s) { server = s; done(); });
  });

  afterEach(function(done) {
    if (server) server.close(done);
    else done();
  });

  it('should GET post content', function(done) {
    setupPoet({server: server, posts: './test/_postsJson'})
      .then(function() { return http.get(server, '/post/test-post-one'); })
      .then(function(content) {
        content.should.match(/<h1>.*Test Post One.*<\/h1>/);
        done();
      }).then(null, done);
  });

  it('should GET post content for mounted poet', function(done) {
    var app = express();
    server.on('request', app);
    setupPoet({
      server: server,
      mount: '/poet', mainApp: app,
      posts: './test/_postsJson'
    }).then(function() { return http.get(server, '/poet/post/test-post-one'); })
      .then(function(content) {
        content.should.match(/<h1>.*Test Post One.*<\/h1>/);
        done();
      }).then(null, done);
  });

  it('should GET content of multiple mounted poets', function(done) {
    var app = express();
    server.on('request', app);
    when.all([
      setupPoet({
        server: server,
        mount: '/poet-1', mainApp: app,
        posts: './test/_postsJson'}),
      setupPoet({
        server: server,
        mount: '/poet-2', mainApp: app,
        posts: './test/deepPosts'})
    ]).then(function() {
      return http.get(server, '/poet-1/post/test-post-two');
    }).then(function(content) {
      content.should.match(/<h1>.*Test Post Two.*<\/h1>/);
    }).then(function() {
      return http.get(server, '/poet-2/post/deep-post');
    }).then(function(content) {
      content.should.match(/<h1>.*Deep Post.*<\/h1>/);
      done();
    }).then(null, done);
  });

});
