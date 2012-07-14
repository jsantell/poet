exports.appendSlash = function ( s ) {
  if ( s.charAt( s.length - 1 ) !== '/' ) {
    s += '/';
  }
  return s;
};

exports.paginationRegex = function ( route ) {
  return new RegExp( '\\\/' + route.match(/^\/(.*)\/$/)[1] + '\\\/([0-9]*)' );
};
