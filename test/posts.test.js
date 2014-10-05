  var
  Poet = require('../lib/poet'),
  express = require('express'),
  chai = require('chai'),
  should = chai.should(),
  expect = chai.expect;

var
  postPreview = '<p><em>Lorem ipsum</em> dolor sit amet, consectetur adipisicing elit.</p>',
  postBody    = '<p><em>Lorem ipsum</em> dolor sit amet, consectetur adipisicing elit.</p>\n<h1>Header 1</h1>\n',
  readMoreAnchorp1 = '<p class="poet-read-more"><a href="/post/test-post-one" title="Read more of Test Post One">read more</a></p>',
  readMoreAnchorp2 = '<p class="poet-read-more"><a href="/post/test-post-two" title="Read more of Test Post Two">read more</a></p>';
  readMoreAnchorp3 = '<p class="poet-read-more"><a href="/post/test-post-three" title="Read more of Test Post Three">read more</a></p>';

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
        var post = poet.posts['test-post-one'];
        post.slug.should.equal('test-post-one');
        post.tags.should.have.length(2);
        post.tags.should.include('a');
        post.tags.should.include('b');
        post.category.should.equal('testing');
        post.url.should.equal('/post/test-post-one');
        post.arbitrary.should.equal('arbitrary content');

        // Also tests HTML rendering
        post.preview.should.equal(postPreview + "\n" + readMoreAnchorp1 );
        post.content.should.equal(postBody);

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
        posts[2].slug.should.equal('test-post-one');
        posts[2].tags.should.have.length(2);
        posts[2].tags.should.include('a');
        posts[2].tags.should.include('b');
        posts[2].category.should.equal('testing');
        posts[2].url.should.equal('/post/test-post-one');
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
        poet.helpers.getPost('test-post-one').should.be.ok;
        poet.helpers.getPost('deep-post').should.be.ok;
        poet.helpers.getPost('deep-post').url.should.be.equal('/post/deep-post');
        done();
      }).then(null, done);
    });
  });

  describe('Correctly handle any path', function () {
    it('should handle "."s in a post path', function (done) {
      var
        app = express(),
        poet = Poet(app, {
          posts: './test/test-posts/period.path'
        });

      poet.init().then(function () {
        var posts = poet.helpers.getPosts();
        posts.should.have.length(1);
        done();
      }).then(null, done);
    });
  });

  describe('Post Attributes', function () {
    it('slug attribute overrides default slug and changes URL', function (done) {
      var
        app = express(),
        poet = Poet(app, {
          posts: './test/test-posts/slug'
        });

      poet.init().then(function () {
        var posts = poet.helpers.getPosts();
        posts[0].slug.should.be.equal('custom-slug');
        posts[0].url.should.be.equal('/post/custom-slug');
        done();
      }).then(null, done);
    });

    it('post.url and readMore links updates when using custom routes in constructor', function (done) {
      var
        app = express(),
        poet = Poet(app, {
          posts: './test/test-posts/slug',
          routes: {
            'post-oh-yeah/:post': 'post',
            'posts-oh-yeah/:posts': 'posts',
            'tags-oh-yeah/:tag': 'tag',
            'cats-oh-yeah/:category': 'category'
          }
        });

      poet.init().then(function () {
        var posts = poet.helpers.getPosts();
        posts[0].slug.should.be.equal('custom-slug');
        posts[0].url.should.be.equal('post-oh-yeah/custom-slug');
        posts[0].preview.should.contain('href="post-oh-yeah/custom-slug"');
        done();
      }).then(null, done);
    });

    it('post.url and readMore links updates when using addRoute', function (done) {
      var
        app = express(),
        poet = Poet(app, {
          posts: './test/test-posts/slug',
          routes: {}
        });

      var handler = function () {}
      poet.addRoute('/myposts/:post', handler);
      poet.addRoute('/pagesss/:page', handler);
      poet.addRoute('/mytags/:tag', handler);
      poet.addRoute('/mycats/:category', handler);

      poet.init().then(function () {
        var posts = poet.helpers.getPosts();
        posts[0].slug.should.be.equal('custom-slug');
        posts[0].url.should.be.equal('/myposts/custom-slug');
        posts[0].preview.should.contain('href="/myposts/custom-slug"');
        done();
      }).then(null, done);
    });
  });
});
