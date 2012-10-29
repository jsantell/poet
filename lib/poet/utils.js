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
    return body.substr( 0, post.previewLength );
  }

  if ( body.indexOf( options.readMoreTag || post.readMoreTag ) !== -1 ) {
    return body.split( options.readMoreTag || post.readMoreTag )[0];
  }

  return body.replace( /\n.*/g, '' );
};
