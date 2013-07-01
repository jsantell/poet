var
  Poet = require('../lib/poet'),
  express = require('express'),
  chai = require('chai'),
  expect = chai.expect;

describe('Locals', function () {
  it('should pass in the locals for the view', function (done) {
    var
      app = express(),
      poet = Poet(app, {
        posts: './test/_postsYaml',
        metaFormat: 'yaml'
      });

    poet.init().then(function () {
      expect(app.locals.getPostCount()).to.equal(4);
      expect(app.locals.getPosts()).to.have.length(4);
      expect(app.locals.getTags()).to.include('a');
      expect(app.locals.getTags()).to.include('b');
      expect(app.locals.getTags()).to.include('c');
      expect(app.locals.getTags()).to.include('d');
      expect(app.locals.getCategories()).to.include('testing');
      expect(app.locals.getCategories()).to.include('other cat');
      expect(app.locals.pageUrl(3)).to.equal('/page/3');
      expect(app.locals.tagUrl('sometag')).to.equal('/tag/sometag');
      expect(app.locals.categoryUrl('somecat')).to.equal('/category/somecat');
      expect(app.locals.getPosts(2,3)).to.have.length(1);
      expect(app.locals.getPageCount()).to.equal(1);
      done();
    });
  });
});
