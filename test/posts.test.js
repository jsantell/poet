var
  Poet = require('../lib/poet'),
  express = require('express'),
  chai = require('chai'),
  should = chai.should(),
  expect = chai.expect;

var
  postPreview = '<p><em>Lorem ipsum</em> dolor sit amet, consectetur adipisicing elit.</p>',
  postBody    = '<p><em>Lorem ipsum</em> dolor sit amet, consectetur adipisicing elit.</p>\n<h1>Header 1</h1>\n',
  readMoreAnchorp1 = '<p><a href="/post/test-one" title="Read more of Test Post One">read more</a></p>',
  readMoreAnchorp2 = '<p><a href="/post/test2" title="Read more of Test Post Two">read more</a></p>';
  readMoreAnchorp3 = '<p><a href="/post/test3" title="Read more of Test Post Three">read more</a></p>';

describe('Posts', function () {
  describe('Posts with JSON front-matter', function () {
    it('should store all the post\'s metadata correctly', function (done) {
      var
        app = express(),
        poet = Poet(app, {
          posts: './test/_postsJson',
          showDrafts: true
        });

      poet.init().then(function () {
        var posts = poet.helpers.getPosts();
        posts.should.have.length(6);
        poet.posts['test-one'].slug.should.equal('test-one');
        poet.posts['test-one'].tags.should.have.length(2);
        poet.posts['test-one'].tags.should.include('a');
        poet.posts['test-one'].tags.should.include('b');
        poet.posts['test-one'].category.should.equal('testing');
        poet.posts['test-one'].url.should.equal('/post/test-one');
        poet.posts['test-one'].arbitrary.should.equal('arbitrary content');

        // Also tests HTML rendering
        poet.posts['test-one'].preview.should.equal(postPreview + "\n" + readMoreAnchorp1 );
        poet.posts['test-one'].content.should.equal(postBody);

        // All posts should be in order
        posts[5].title.should.equals('Test Post Four - A Draft');
        posts[4].title.should.equal('Read More Test');
        posts[3].title.should.equal('Jade Test');
        posts[2].title.should.equal('Test Post One');
        posts[1].title.should.equal('Test Post Three');
        posts[0].title.should.equal('Test Post Two');

        // One test post is a draft
        posts[5].draft.should.equal(true);

        // Preview parameter should work and turn into html
        posts[0].preview.should.equal('<p><em>some content</em></p>' + '\n' + readMoreAnchorp2 );
        done();
      }).then(null, done);
    });

    it('should format preview according to previewLength', function (done) {
      var
        app = express(),
        poet = Poet(app, {
          posts: './test/_postsJson',
          showDrafts: true
        });

      poet.init().then(function () {
        var posts = poet.helpers.getPosts();
        posts[1].preview.should.equal('<p><em>Lorem ipsum</em> dolor sit amet</p>' + "\n" + readMoreAnchorp3);
        done();
      });
    });
  });

  describe('Posts with YAML front-matter', function () {
    it("should store all the post's metadata correctly", function (done) {
      var
        app = express(),
        poet = Poet(app, {
          posts: './test/_postsYaml',
          showDrafts: true,
          metaFormat: 'yaml'
        });

      poet.init().then(function () {
        var posts = poet.helpers.getPosts();
        posts.should.have.length(4);
        posts[2].title.should.equal('Test Post One');
        posts[2].slug.should.equal('test-one');
        posts[2].tags.should.have.length(2);
        posts[2].tags.should.include('a');
        posts[2].tags.should.include('b');
        posts[2].category.should.equal('testing');
        posts[2].url.should.equal('/post/test-one');
        posts[2].arbitrary.should.equal('arbitrary content');

        // Also tests HTML rendering
        posts[2].preview.should.equal( postPreview + "\n" + readMoreAnchorp1 );
        posts[2].content.should.equal( postBody );

        // All posts should be in order
        posts[3].title.should.equal('Test Post Four - A Draft');
        posts[1].title.should.equal('Test Post Three');
        posts[0].title.should.equal('Test Post Two');

        // Preview parameter should work and turn into html
        posts[0].preview.should.equal( '<p><em>some content</em></p>' + "\n" + readMoreAnchorp2);

        done();
      }).then(null, done);
    });

    it('should format preview according to previewLength', function (done) {
      var
        app = express(),
        poet = Poet(app, {
          posts: './test/_postsYaml',
          showDrafts: true,
          metaFormat: 'yaml'
        });

      poet.init().then(function () {
        var posts = poet.helpers.getPosts();
        posts[1].preview.should.equal('<p><em>Lorem ipsum</em> dolor sit amet</p>' + "\n" + readMoreAnchorp3);
        done();
      }).then(null, done);
    });
  });

  describe('Should recursively go through posts directory', function () {
    it('should descend posts directory', function (done) {
      var
        app = express(),
        poet = Poet(app, {
          posts: './test/deepPosts'
        });

      poet.init().then(function () {
        var posts = poet.helpers.getPosts();
        posts.should.have.length(2);
        poet.helpers.getPost('deep').should.be.ok;
        done();
      }).then(null, done);
    });
  });

  describe('Correctly handle any path', function () {
    it('should handle "."s in a post path', function (done) {
      var
        app = express(),
        poet = Poet(app, {
          posts: './test/test.posts'
        });

      poet.init().then(function () {
        var posts = poet.helpers.getPosts();
        posts.should.have.length(1);
        done();
      }).then(null, done);
    });
  });
});
