module.exports = function ( core ) {
  return function ( req, res, next ) {
    req.poet = core;
    next();
  };
};
