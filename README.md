Poet [![Build Status](https://travis-ci.org/jsantell/poet.png)](https://travis-ci.org/jsantell/poet)
======

**[Looking for maintenance help!](https://github.com/jsantell/poet/issues/91)**

Poet is a lightweight blogging library. Renders markdown, pug, or any templated files as posts, tag it up with metadata that's passed into any view engine you want, instant pagination, tag and category views.

![The Node Poet](https://raw.github.com/jsantell/poet/gh-pages/img/poet.png)

## Support

If using Express 3, use **v1.1.0**. For sites using Express 4+, use **v2.0.0+**.

## Documentation

Full documentation for *Poet* can be found at [http://jsantell.github.io/poet](http://jsantell.github.io/poet)

## Poet In Action

These sites are using Poet for their blogging, check them out! Ping me, or send a PR if you too are using Poet in the wild.

* [Morgondag](http://morgondag.nu)
* [DevinYoungWeb.com](http://devinyoungweb.com)
* [The Rustual Boy emulator blog](http://rustualboy.com/blog)

## Installing

* `npm install poet`

## Setup

Include Poet in your package.json and add it to your app, passing in your Express app and options. Call the `init` method and routes will be set up!

```javascript
var
  express = require('express'),
  app = express(),
  Poet = require('poet');
  
var poet = Poet(app, {
  posts: './_posts/',
  postsPerPage: 5,
  metaFormat: 'json'
});

poet.init().then(function () {
  // ready to go!
});

/* set up the rest of the express app */
```

## Development

To run tests, run `npm test` from the project root to run the Mocha tests. Generate documentation by updating the `docs.md` and running `make`.

## Contributing

Please read the [CONTRIBUTING.md](https://github.com/jsantell/poet/blob/master/CONTRIBUTING.md) for guides on contributions.

## License

MIT License, Copyright (c) 2012 Jordan Santell

## Attribution

Many thanks :blue_heart: to [Brittany Fedor](http://bfedor.com/) for the sweet art!


