var
  Poet = require('../lib/poet'),
  express = require('express'),
  chai = require('chai'),
  should = chai.should(),
  expect = chai.expect;

var pEl = "<p><em>Lorem ipsum</em> dolor sit amet, consectetur adipisicing elit.</p>";
var h1El = "<h1>Header 1</h1>";
var scriptBody  = '<script>console.log(\'test\');</script>';

describe('Templating', function () {
  it('should correctly compile markdown', function (done) {
    var
      app = express(),
      poet = Poet(app, {
        posts: './test/_postsJson'
      });

    poet.init().then(function () {
      var posts = poet.posts;
      posts['test-post-one'].content.should.contain(pEl);
      posts['test-post-one'].content.should.contain(h1El);
      done();
    }).then(null, done);
  });

  it('should correctly compile jade', function (done) {
    var
      app = express(),
      poet = Poet(app, {
        posts: './test/_postsJson'
      });

    poet.init().then(function () {
      var posts = poet.posts;
      posts['jade-test'].content.should.contain(pEl);
      posts['jade-test'].content.should.contain(h1El);
      done();
    }).then(null, done);
  });

  it('should correctly compile jade with includes', function (done) {
    var
      app = express(),
      poet = Poet(app, {
        posts: './test/_postsJson'
      });

    poet.init().then(function () {
      poet.posts['jade-test'].content.should.contain("Include Me!");
      done();
    }).then(null, done);
  });


  it('should correctly compile jade with app.locals.access', function (done) {
    var
      app = express(),
      poet = Poet(app, {
        posts: './test/_postsJson'
      });
    app.locals.foo = true;
    poet.init().then(function () {
      poet.posts['jade-test'].content.should.contain("foo is true");
      done();
    }).then(null, done);
  });

  it('should correctly render with any custom formatter', function (done) {
    var
      app = express(),
      poet = Poet(app, {
        posts: './test/_postsJson'
      });

    poet.addTemplate({
      ext: 'custom',
      fn: function (opts) {
        return opts.source.replace(/\*(.*?)\*/g, '<$1>');
      }
    }).init().then(function () {
      var posts = poet.posts;
      posts['custom-test'].content.should.contain(pEl);
      posts['custom-test'].content.should.contain(h1El);
      done();
    }).then(null, done);
  });

  it('should correctly render with any custom formatter asynchronously', function (done) {
    var
      app = express(),
      poet = Poet(app, {
        posts: './test/_postsJson'
      });

    poet.addTemplate({
      ext: 'custom',
      fn: function (opts, callback) {
        callback(null, opts.source.replace(/\*(.*?)\*/g, '<$1>'));
      }
    }).init().then(function () {
      var posts = poet.posts;
      posts['custom-test'].content.should.contain(pEl);
      posts['custom-test'].content.should.contain(h1El);
      done();
    }).then(null, done);
  });

  it('markdown should not strip out HTML elements', function () {
    var
      app = express(),
      poet = Poet(app, {
        posts: './test/_postsJson'
      });

    poet.init().then(function () {
      var posts = poet.posts;
      posts['test-post-three'].content.should.contain(scriptBody);
    });
  });

  describe('Errors', function() {

    var realEnv;

    beforeEach(function() { realEnv = process.env.NODE_ENV; });

    afterEach(function() { process.env.NODE_ENV = realEnv; });

  	it('should not appear in production', function (done) {
      process.env.NODE_ENV = 'production';
      var
          app = express(),
          poet = Poet(app, {
            posts: './test/_postsWithErrorJson'
          });
      poet.init().then(function () {
        Object.keys(poet.posts).should.have.length(1);
        done();
      }).then(null, done);
    });

    it('should be rendered in non production env', function (done) {
      delete process.env.NODE_ENV;
      var
          app = express(),
          poet = Poet(app, {
            posts: './test/_postsWithErrorJson'
          });

      poet.init().then(function () {
        var posts = poet.posts;
        Object.keys(posts).should.have.length(2);
        poet.posts['jade-test-with-error'].content.should.contain("> 3| Foo?");
        done();
      }).then(null, done);
    });
  });

  it('should expose registered template engines on templateEngines', function () {
    var
      app = express(),
      poet = Poet(app, {
        posts: './test/_postsJson'
      });

    poet.templateEngines.marked.setOptions({
      sanitize: true
    });

    poet.init().then(function () {
      var posts = poet.posts;
      posts['test-post-three'].content.should.not.contain(scriptBody);
    });
  });
});