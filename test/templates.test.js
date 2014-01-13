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
      posts['test-one'].content.should.contain(pEl);
      posts['test-one'].content.should.contain(h1El);
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
      posts['jadeTemplate'].content.should.contain(pEl);
      posts['jadeTemplate'].content.should.contain(h1El);
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
      fn: function (s) {
        s = s.replace(/\*(.*?)\*/g, '<$1>');
        return s;
      }
    }).init().then(function () {
      var posts = poet.posts;
      posts['customTemplate'].content.should.contain(pEl);
      posts['customTemplate'].content.should.contain(h1El);
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
      fn: function (s, callback) {
        callback(null, s.replace(/\*(.*?)\*/g, '<$1>'));
      }
    }).init().then(function () {
      var posts = poet.posts;
      posts['customTemplate'].content.should.contain(pEl);
      posts['customTemplate'].content.should.contain(h1El);
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
      posts['test3'].content.should.contain(scriptBody);
    });
  });
});
