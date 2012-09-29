var
  markdown = require( 'node-markdown' ).Markdown,
  jade     = require( 'jade' ).compile;

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
