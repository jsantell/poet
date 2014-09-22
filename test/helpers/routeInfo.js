exports.getCallback = function (app, path) {

    if (app._router && app._router.stack) {
        for (var i = 0; i < app._router.stack.length; i++) {
            var current = app._router.stack[i];
            if (current.route && current.route.path && current.route.path == path) {
                return current.route.stack[0].handle;
            }
        }
    }

    return null;
}