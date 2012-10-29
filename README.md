Poet
======

Poet has your code-blogging back. Renders markdown, jade, or any templated files as posts, tag it up with metadata that's passed into any view engine you want, instant pagination, tag and category views, and home in time for dinner.

View the source for [jsantell.com](https://github.com/jsantell/jsantell.com) to see an example of Poet in use. Much `<3` to [Brittany Fedor](http://bfedor.com/) for the sweet art!

![The Node Poet](https://raw.github.com/jsantell/poet/gh-pages/img/poet.png)

## Documentation

Full documentation for *Poet* can be found at [http://jsantell.github.com/poet](http://jsantell.github.com/poet)

## Poet In Action

These sites are using Poet for their blogging, check them out! Ping me, or send a PR if you too are using Poet in the wild.

* [Yellow Pages Engineering](http://engineering.yp.com/)
* [BryanPaluch.com](http://bryanpaluch.com)

## Installing

* `npm install poet`

## Setup

Include Poet in your package.json and add it to your app, passing in your Express app and options.
```javascript
var
  express = require('express'),
  app     = express(),
  poet    = require('poet')( app );

poet.set({
  posts: './_posts/',
  postsPerPage: 5,
  metaFormat: 'json'
})
  .createPostRoute()
  .createPageRoute()
  .createTagRoute()
  .createCategoryRoute()
  .init();
```

### Options

* `posts` path to directory of your files of posts (default: `./\_posts/`)
* `metaFormat` format of your front matter on every blog post. Can be `yaml` or `json`. (default: `json`)
* `postsPerPage` How many posts are displayed per page in the page route
* `readMore` A function taking the post object as the only parameter, returning a string that is appended to the post's preview value. By default will be a function returning `<a href="{post.link}">{post.title}</a>`

## Posts

Posts are constructed in markdown, jade, or any templated language of your choice (read [docs](http://jsantell.github.com/poet#format)), prefixed by front matter via [YAML](https://github.com/mojombo/jekyll/wiki/YAML-Front-Matter) or [JSON](https://github.com/jsantell/node-json-front-matter). All attributes are stored into the post object.

## Development

To run tests, run `npm test` from the project root to run the Mocha tests.
