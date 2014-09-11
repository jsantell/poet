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

  // If no routes specified, abort
  if (!routes) return;

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
    poet.app._router.stack.forEach(function (stackItem, index) {
      if (stackItem.route && stackItem.route.path && stackItem.route.path === route) {
          poet.app._router.stack.splice(index, 1);
      }
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
      postsPerPage = poet.options.postsPerPage,
      page = req.params.page,
      lastPost = page * postsPerPage,
      posts = poet.helpers.getPosts(lastPost - postsPerPage, lastPost);
    if (posts.length) {
      res.render(view, {
        posts: posts,
        page: page
      });
    } else {
      next();
    }
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
