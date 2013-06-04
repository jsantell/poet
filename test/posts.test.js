var
  express = require( 'express' ),
  chai    = require( 'chai' ),
  should  = chai.should(),
  expect  = chai.expect;

var
  postPreview = '<p><em>Lorem ipsum</em> dolor sit amet, consectetur adipisicing elit.</p>',
  postBody    = '<p><em>Lorem ipsum</em> dolor sit amet, consectetur adipisicing elit.</p>\n<h1>Header 1</h1>\n',
  readMoreAnchorp1 = '<p><a href="/post/test1" title="Read more of Test Post One">read more</a></p>',
  readMoreAnchorp2 = '<p><a href="/post/test2" title="Read more of Test Post Two">read more</a></p>';
  readMoreAnchorp3 = '<p><a href="/post/test3" title="Read more of Test Post Three">read more</a></p>';

describe( 'Posts', function () {
  describe( 'Posts with JSON front-matter', function () {
    it( "should store all the post's metadata correctly", function ( done ) {
      var
        app = express(),
        poet = require( '../lib/poet' )( app );

      // Should default to json
      poet.set({ 
        posts: './test/_postsJson',
        showDrafts: true
      }).init(function () {
        var posts = app.locals.postList;
        posts.should.have.length(6);
        posts[2].slug.should.equal('test1');
        posts[2].tags.should.have.length(2);
        posts[2].tags.should.include('a');
        posts[2].tags.should.include('b');
        posts[2].category.should.equal('testing');
        posts[2].url.should.equal('/post/test1');
        posts[2].arbitrary.should.equal('arbitrary content');

        // Also tests HTML rendering
        posts[2].preview.should.equal( postPreview + "\n" + readMoreAnchorp1 );
        posts[2].content.should.equal( postBody );

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
        posts[0].preview.should.equal( '<p><em>some content</em></p>' + "\n" + readMoreAnchorp2 );

        done();
      });
    });

    it( 'should format preview according to previewLength', function ( done ) {
      var
        app = express(),
        poet = require( '../lib/poet' )( app );

      poet.set({ posts: './test/_postsJson', metaFormat: 'json' }).init(function () {
        var posts = app.locals.postList;
        posts[1].preview.should.equal('<p><em>Lorem ipsum</em> dolor sit amet</p>' + "\n" + readMoreAnchorp3);
        done();
      });
    });
  });

  describe( 'Posts with YAML front-matter', function () {
    it( "should store all the post's metadata correctly", function ( done ) {
      var
        app = express(),
        poet = require( '../lib/poet' )( app );

      poet.set({ 
        posts: './test/_postsYaml',
        metaFormat: 'yaml',
        showDrafts: true
      }).init(function () {
        var posts = app.locals.postList;
        posts.should.have.length(4);
        posts[2].title.should.equal('Test Post One');
        posts[2].slug.should.equal('test1');
        posts[2].tags.should.have.length(2);
        posts[2].tags.should.include('a');
        posts[2].tags.should.include('b');
        posts[2].category.should.equal('testing');
        posts[2].url.should.equal('/post/test1');
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
      });
    });

    it( 'should format preview according to previewLength', function ( done ) {
      var
        app = express(),
        poet = require( '../lib/poet' )( app );

      poet.set({ posts: './test/_postsYaml', metaFormat: 'yaml' }).init(function () {
        var posts = app.locals.postList;
        posts[1].preview.should.equal('<p><em>Lorem ipsum</em> dolor sit amet</p>' + "\n" + readMoreAnchorp3);
        done();
      });
    });
  });

});
