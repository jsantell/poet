exports.req = function ( params ) {
  var req = {
    params : params
  };
  return req;
}

exports.res = function ( callback ) {
  return {
    viewName : '',
    data     : {},
    render   : function ( view, data ) { this.viewName = view; this.data = data; callback(); },
    json     : function ( json ) { this._json = json; callback(); }
  };
}
