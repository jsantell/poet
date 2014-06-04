exports.getCallback = function ( app, path ) {

  if (app.routes && app.routes.get) {
    for (var i = 0; i < app.routes.get.length; i++) {
      if (app.routes.get[i].path == path) {
        return app.routes.get[i].callbacks[0];
      }
    }
  } else {
    if (app._router && app._router.stack) {
      for (var i = 0; i < app._router.stack.length; i++) {
        var current = app._router.stack[i];
        if (current.route && current.route.path && current.route.path == path) {
          return current.route.stack[0].handle;
        }
      }
    }
  }
  return null;
}
