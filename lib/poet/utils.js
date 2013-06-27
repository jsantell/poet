exports.appendSlash = function ( s ) {
  if ( s.charAt( s.length - 1 ) !== '/' ) {
    s += '/';
  }
  return s;
};

exports.stripRouteParams = function ( route ) {
  return route.match( /[^\:]*/ )[0];
}

// Generate preview text for a post
// In order of priority, first a `preview` property,
// then a `previewLength` property, followed by the 
// customizable `more` tag
exports.getPreview = function ( post, body, options ) {
  if ( post.preview ) {
    return post.preview;
  }

  if ( post.previewLength ) {
    return stripLeadingReturn( body ).substr( 0, post.previewLength );
  }

  if ( body.indexOf( options.readMoreTag || post.readMoreTag ) !== -1 ) {
    return body.split( options.readMoreTag || post.readMoreTag )[0];
  }

  return stripLeadingReturn( body ).replace( /\n.*/g, '' );
};

function stripLeadingReturn (string) {
  return ( string || '' ).replace( /^\n*/, '' );
}

/**
 * Takes `lambda` function and returns a method. When returned method is
 * invoked, it calls the wrapped `lambda` and passes `this` as a first argument
 * and given arguments as the rest.
 *
 * @params {Function} lambda
 * @returns {Function}
 */

exports.method = function method (lambda) {
  return function () {
    return lambda.apply(null, [this].concat(Array.prototype.slice(arguments)));
  };
};
