var
  markdown = require( 'marked' ),
  jade     = require( 'jade' ).compile;

// Configure defaults for marked to keep compatibility
markdown.setOptions({
  sanitize: false,
  pedantic: true
});

module.exports = {
  jade : {
    ext : 'jade',
    fn : function ( string ) {
      return jade( string )();
    }
  },
  markdown : {
    ext : [ 'markdown', 'md' ],
    fn : function ( string ) {
      return markdown( string );
    }
  }
};
