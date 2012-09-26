Poet
======

Poet has your code-blogging back. Renders markdown files as posts, tag it up with metadata that's passed into any view engine you want, instant pagination, tag and category views, and home in time for dinner.

View the source for [jsantell.com](https://github.com/jsantell/jsantell.com) to see an example of Poet in use. Much `<3` to [Brittany Fedor](http://bfedor.com/) for the sweet art!

![The Node Poet](https://raw.github.com/jsantell/poet/gh-pages/img/poet.png)

### Documentation

Full documentation for *Poet* can be found at [jsantell.github.com/poet](https://github.com/jsantell/poet)

### Installing

* `npm install poet`

### Setup

Include Poet in your package.json and add it to your app, passing in your Express app and options.
```javascript
var
  express = require('express'),
  poet    = require('poet'),
  app     = express.createServer();

poet( app, {
  posts: './_posts/',
  postsPerPage: 5,
  metaFormat: 'json'
})
  .createPostRoute()
  .createPostListRoute()
  .createTagRoute()
  .createCategoryRoute()
  .init();
```

#### Options

* `posts` path to directory of your markdown files of posts (default: `./\_posts/`)
* `metaFormat` format of your front matter on every blog post. Can be `yaml` or `json`. (default: `json`)
* `postsPerPage` How many posts are displayed per page in the post list

### Posts

Posts are constructed in markdown, prefixed by front matter via [YAML](https://github.com/mojombo/jekyll/wiki/YAML-Front-Matter) or [JSON](https://github.com/jsantell/node-json-front-matter). All attributes are stored into the post object.

### Development

To run tests, run `npm test` from the project root to run the Mocha tests.
