var
  Poet    = require('../lib/poet'),
  express = require('express'),
  chai    = require('chai'),
  should  = chai.should(),
  expect  = chai.expect,
  routes  = require('../lib/poet/routes'),
  reqMock = require('./helpers/routeMocks').req,
  resMock = require('./helpers/routeMocks').res,
  routeInfo = require('./helpers/routeInfo');

describe('Routes', function () {
  it('should make the correct auto routes by default', function (done) {
    var
      app = express(),
      poet = Poet(app, { posts: './test/_postsJson' });

    poet.init().then(function () {
      routeInfo.getCallback(app, '/post/:post')
        .toString().should.equal(routes.postRouteGenerator().toString());
      routeInfo.getCallback(app, '/page/:page')
        .toString().should.equal(routes.pageRouteGenerator().toString());
      routeInfo.getCallback(app, '/tag/:tag')
        .toString().should.equal(routes.tagRouteGenerator().toString());
      routeInfo.getCallback(app, '/category/:category')
        .toString().should.equal(routes.categoryRouteGenerator().toString());
      done();
    });
  });

  it('should use the default views', function (done) {
    var
      app = express(),
      poet = Poet(app, { posts: './test/_postsJson' });

    var
      reqPost = reqMock({ post: 'test-one'}),
      reqPage = reqMock({ page: 1}),
      reqTag = reqMock({ tag: 'a'}),
      reqCategory = reqMock({ category: 'testing' }),
      resPost = resMock(function () {
        resPost.viewName.should.equal('post');
        checkDone();
      }),
      resPage = resMock(function () {
        resPage.viewName.should.equal('page');
        checkDone();
      }),
      resTag = resMock(function () {
        resTag.viewName.should.equal('tag');
        checkDone();
      }),
      resCategory = resMock(function () {
        resCategory.viewName.should.equal('category');
        checkDone();
      });

    var checkDone = (function () {
      var count = 0;
      return function () {
        if ( ++count === 4 ) { done(); }
      };
    })();

    poet.init().then(function () {
      routeInfo.getCallback(app, '/post/:post')(reqPost, resPost);
      routeInfo.getCallback(app, '/page/:page')(reqPage, resPage);
      routeInfo.getCallback(app, '/tag/:tag')(reqTag, resTag);
      routeInfo.getCallback(app, '/category/:category')(reqCategory, resCategory);
    });
  });

  it('should allow configurable routes in the config', function (done) {
    var
      app = express(),
      poet = Poet(app, {
        posts: './test/_postsJson',
        routes: {
          '/myposts/:post': 'post',
          '/pagesss/:page': 'page',
          '/mytags/:tag': 'tag',
          '/mycats/:category': 'category'
        }
      });

    poet.init().then(function () {
      routeInfo.getCallback(app, '/myposts/:post')
        .toString().should.equal(routes.postRouteGenerator().toString());
      routeInfo.getCallback(app, '/pagesss/:page')
        .toString().should.equal(routes.pageRouteGenerator().toString());
      routeInfo.getCallback(app, '/mytags/:tag')
        .toString().should.equal(routes.tagRouteGenerator().toString());
      routeInfo.getCallback(app, '/mycats/:category')
        .toString().should.equal(routes.categoryRouteGenerator().toString());
      done();
    });
  });

  it('should allow manually added routes', function(done) {
    var
      app = express(),
      poet = Poet(app),
      handler = function (request, response) {};

    poet.addRoute('/myposts/:post', handler);
    poet.addRoute('/pagesss/:page', handler);
    poet.addRoute('/mytags/:tag', handler);
    poet.addRoute('/mycats/:category', handler);
    poet.addRoute('/', handler);

    poet.init();

    routeInfo.getCallback(app, '/myposts/:post')
      .should.equal(handler);
    routeInfo.getCallback(app, '/pagesss/:page')
      .should.equal(handler);
    routeInfo.getCallback(app, '/mytags/:tag')
      .should.equal(handler);
    routeInfo.getCallback(app, '/mycats/:category')
      .should.equal(handler);
    routeInfo.getCallback(app, '/')
      .should.equal(handler);
    done();
  });

  it('should use configurable views', function ( done ) {
    var
      app = express(),
      poet = Poet(app, {
        posts: './test/_postsJson',
        routes: {
          '/myposts/:post': 'postView',
          '/pagesss/:page': 'pageView',
          '/mytags/:tag': 'tagView',
          '/mycats/:category': 'categoryView'
        }
      }),
      reqPost = reqMock({ post: 'test-one'}),
      reqPage = reqMock({ page: 1}),
      reqTag = reqMock({ tag: 'a'}),
      reqCategory = reqMock({ category: 'testing' }),
      resPost = resMock(function () {
        resPost.viewName.should.equal('postView');
        checkDone();
      }),
      resPage = resMock(function () {
        resPage.viewName.should.equal('pageView');
        checkDone();
      }),
      resTag = resMock(function () {
        resTag.viewName.should.equal('tagView');
        checkDone();
      }),
      resCategory = resMock(function () {
        resCategory.viewName.should.equal('categoryView');
        checkDone();
      });

    var checkDone = (function () {
      var count = 0;
      return function () {
        if ( ++count === 4 ) { done(); }
      };
    })();

    poet.init().then(function () {
      routeInfo.getCallback(app, '/myposts/:post')(reqPost, resPost);
      routeInfo.getCallback(app, '/pagesss/:page')(reqPage, resPage);
      routeInfo.getCallback(app, '/mytags/:tag')(reqTag, resTag);
      routeInfo.getCallback(app, '/mycats/:category')(reqCategory, resCategory);
    });
  });
});
