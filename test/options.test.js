var
  express = require( 'express' ),
  chai    = require( 'chai' ),
  should  = chai.should(),
  expect  = chai.expect;

var
  readMoreLink = '<a href="/post/test2">Test Post Two</a>';

describe( 'Options', function () {
  describe( 'readMoreLink', function () {
    it( 'should be a function that returns markup appended to the preview', function ( done ) {
      var
        app = express(),
        poet = require( '../lib/poet' )( app );

      poet.set({
        posts: './test/_postsJson',
        readMoreLink: function ( post ) {
          return '<a href="'+post.url+'">'+post.title+'</a>';
        }
      }).init(function ( core ) {
        var posts = app.locals.postList;
        posts[0].preview.should.equal( '<p><em>some content</em></p>' + "\n" + readMoreLink );
        done();
      });
    });
  });

  describe( 'readMoreTag', function () {
    var customPreview = '<p><em>Lorem ipsum</em></p>\n<p><a href="/post/readMore" title="Read more of Read More Test">read more</a></p>',
      defaultPreview = '<p><em>Lorem ipsum</em>\n!!!more!!!\n<em>more ipsum</em></p>\n<p><a href="/post/readMore" title="Read more of Read More Test">read more</a></p>';
    it( 'should by default use <!--more-->', function ( done ) {
      var
        app = express(),
        poet = require( '../lib/poet' )( app );

      poet.set({
        posts: './test/_postsJson'
      }).init(function ( core ) {
        var posts = app.locals.postList;
        var s = '';
        posts.forEach(function(p){s+=p.title+'+'+p.date+':'});
        posts[4].preview.should.equal( defaultPreview, s );
        done();
      });
    });
    it( 'should be an option that specifies where the preview is cut off', function ( done ) {
      var
        app = express(),
        poet = require( '../lib/poet' )( app );

      poet.set({
        posts: './test/_postsJson',
        readMoreTag: '!!!more!!!'
      }).init(function ( core ) {
        var posts = app.locals.postList;
        var s = '';
        posts.forEach(function(p){s+=p.title+'+'+p.date+':'});
        posts[4].preview.should.equal( customPreview, s);
        done();
      });
    });
  });
});
