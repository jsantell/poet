var
  Poet = require('../lib/poet'),
  express = require('express'),
  chai = require('chai'),
  should = chai.should(),
  expect = chai.expect;

describe('helpers.postWithTag()', function () {
  it('should return posts ordered by date, newest first', function (done) {
    setup(function (poet) {
      var posts = poet.helpers.postsWithTag('a');
      (posts[0].date.getTime() > posts[1].date.getTime()).should.equal(true);
      (posts[1].date.getTime() > posts[2].date.getTime()).should.equal(true);
      done();
    }, done);
  });
});

describe('helpers.postWithCategories()', function () {
  it( 'should return posts ordered by date, newest first', function (done) {
    setup(function (poet) {
      var posts = poet.helpers.postsWithCategory('testing');
      (posts[0].date.getTime() > posts[1].date.getTime()).should.equal(true);
      (posts[1].date.getTime() > posts[2].date.getTime()).should.equal(true);
      done();
    }, done);
  });
});

function setup (callback, done) {
  var app = express();
  var poet = Poet(app, {
    posts: './test/_postsJson'
  });
  poet.init().then(callback, done);
}
