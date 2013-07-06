Poet [![Build Status](https://travis-ci.org/jsantell/poet.png)](https://travis-ci.org/jsantell/poet)
======

Poet has your code-blogging back. Renders markdown, jade, or any templated files as posts, tag it up with metadata that's passed into any view engine you want, instant pagination, tag and category views, and home in time for dinner.

View the source for [jsantell.com](https://github.com/jsantell/jsantell.com) to see an example of Poet in use. Much `<3` to [Brittany Fedor](http://bfedor.com/) for the sweet art!

![The Node Poet](https://raw.github.com/jsantell/poet/gh-pages/img/poet.png)

## New Release

**v1.0.0rc**
A giant refactor has occurred -- all tests are passing, and be sure to test when upgrading to this release candidate. Some features may be missing or not working as intended. If you notice any issues, please file a bug.

Some features have been removed and changed, so please note the changes in the change log -- your site may need to be slightly changed to accomodate the latest.

[**Changes in v1.0.0rc**](https://github.com/jsantell/poet/blob/master/CHANGELOG.md)

## Documentation

Full documentation for *Poet* can be found at [http://jsantell.github.io/poet](http://jsantell.github.io/poet)

## Poet In Action

These sites are using Poet for their blogging, check them out! Ping me, or send a PR if you too are using Poet in the wild.

* [Yellow Pages Engineering](http://engineering.yp.com/)
* [BryanPaluch.com](http://bryanpaluch.com)
* [EffectiveIdea.com](http://effectiveidea.com)
* [fictitious entry](http://fictitiousentry.com/)
* [AndreasKlein.org](http://v7.andreasklein.org)
* [Keyboardsurfer](kbsurfer.com)

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
