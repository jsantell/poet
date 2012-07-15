exports.appendSlash = function ( s ) {
  if ( s.charAt( s.length - 1 ) !== '/' ) {
    s += '/';
  }
  return s;
};

exports.stripRouteParams = function ( route ) {
  return route.match( /[^\:]*/ )[0];
}
