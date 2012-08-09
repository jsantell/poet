{{{
    "title"    : "Extend your node requests",
    "tags"     : [ "node" ],
    "category" : "node",
    "date"     : "7-22-2012"
}}}

Jumps in your middleware and extends route requests with references

## Installation ##

`npm install request-extend`

## Methods ##

`reqExtend([namespace,] object [, force]);`
Merges `object`'s keys and values with a routes request variable, which optionally can be contained under a property of `namespace`. `force` defaults to true, and controls whether or not `object` values should overwrite properties already on the request variable.

## Usage ##

```javascript```
var
  express = require( 'express' ),
  reqExtend = require( 'request-extend' ),
  app = express.createServer();

var
  models = {
    user : require( './models/user' ),
    data : require( './models/data' )
  },
  config = require( './config' );

app.configure(function () {
  app.set( 'views', __dirname + '/views' );
  app.set( 'view engine', 'jade' );
  app.use( reqExtend( 'models', models ));
  app.use( reqExtend( 'config', config ));
  app.use( express.static( __dirname + '/public' ));
  app.use( app.router );
});
```

Adds `req.models.user`, `req.models.data` and `req.config` to all requests in your routes.

```javascript
app.get( '/users', function ( req, res, next ) {
  res.render( 'users', { users: req.models.user });
});
```

## Tests ##

Run `node tests/runTests.js` from project root -- testing uses `nodeunit`
