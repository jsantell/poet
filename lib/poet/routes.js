var utils = require('./utils');
var routeMap = {
  post: postRouteGenerator,
  page: pageRouteGenerator,
  tag: tagRouteGenerator,
  category: categoryRouteGenerator
};

/**
 * Takes a `poet` instance and generates routes based off of
 * `poet.options.routes` mappings.
 *
 * @params {Object} poet
 */

function bindRoutes (poet) {
  var app = poet.app;
  var routes = poet.options.routes;

  Object.keys(routes).map(function (route) {
    var type = utils.getRouteType(route);
    if (!type) return;

    app.get(route, routeMap[type](poet, routes[route]));
  });
}
exports.bindRoutes = bindRoutes;

function addRoute (poet, route, handler) {
  var routes = poet.options.routes;
  var type = utils.getRouteType(route);
  var currentRoute = utils.getRoute(routes, type);
  if (currentRoute) {
    // Remove current route
    poet.app.routes.get.forEach(function (route, index) {
      if (currentRoute === route.path)
        poet.app.routes.get.splice(index, 1);
    });
    // Update options route hash
    delete poet.options.routes[currentRoute];
  }
  poet.options.routes[route] = handler;
  poet.app.get(route, handler);
  return poet;
}
exports.addRoute = addRoute;

function postRouteGenerator (poet, view) {
  return function postRoute (req, res, next) {
    var post = poet.helpers.getPost(req.params.post);
    if (post) {
      res.render(view, { post: post });
    } else {
      next();
    }
  };
}
exports.postRouteGenerator = postRouteGenerator;

function pageRouteGenerator (poet, view) {
  return function pageRoute (req, res, next) {
    var
      page = req.params.page,
      lastPost = page * poet.options.postsPerPage;
    res.render(view, {
      posts: poet.helpers.getPosts(lastPost - poet.options.postsPerPage, lastPost),
      page: page
    });
  };
}
exports.pageRouteGenerator = pageRouteGenerator;

function categoryRouteGenerator (poet, view) {
  return function categoryRoute (req, res, next) {
    var
      cat = req.params.category,
      posts = poet.helpers.postsWithCategory(cat);
    if (posts.length) {
      res.render(view, {
        posts: posts,
        category: cat
      });
    } else {
      next();
    }
  };
}
exports.categoryRouteGenerator = categoryRouteGenerator;

function tagRouteGenerator (poet, view) {
  return function tagRoute (req, res, next) {
    var
      tag = req.params.tag,
      posts = poet.helpers.postsWithTag(tag);
    if (posts.length) {
      res.render(view, {
        posts: posts,
        tag: tag
      });
    } else {
      next();
    }
  };
}
exports.tagRouteGenerator = tagRouteGenerator;
