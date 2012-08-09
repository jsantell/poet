module.exports = function ( app, core ) {
  return function () {
    app.locals( core );
  };
};
