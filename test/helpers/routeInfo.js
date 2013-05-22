exports.getCallback = function ( app, path ) {
  var get_length = app.routes.get.length;

  for (var i = 0; i < get_length; i++) {
    if (app.routes.get[i].path == path) {
      return app.routes.get[i].callbacks[0];
    }
  }

  return null;
}
