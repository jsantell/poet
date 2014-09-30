var nodefn = require('when/node/function');
var when   = require("when");
var http   = require("http");

// starts a http server on an open port
exports.setupServer = function(app) {
  var server = http.createServer(app);
  return when.promise(function(resolve, _, _) {
    (function findOpenPort(port) {
      var server = http.createServer();
      server.listen(port, function() {
        server.once('close', function() { resolve(port); });
        server.close();
      });
      server.on('error', function() { findOpenPort(port + 1); });
    }(40553));
  })
  .then(nodefn.lift(server.listen.bind(server)))
  .then(function() { return server; });
};

// http GET
exports.get = function(server, path) {
  return when.promise(function(resolve, reject, notify) {
    http.get({
      hostname: server.address().address,
      port: server.address().port,
      path: path
    }, function(res) {
      var data = '';
      res.on('data', function(d) { data += String(d); });
      res.on('end', function() {
        if (res.statusCode >= 400) reject(new Error('GET failed: ' + res.statusCode));
        else resolve(data);
      });
    });
  });
};
