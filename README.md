swag-blog
======

Swag has your code-blogging back. Renders markdown files as posts, tag it up with metadata that's passed into any view engine you want, instant pagination, tag and category views, and home in time for dinner.

View the source for [jsantell.com](https://github.com/jsantell/jsantell.com) to see an example of it in use.

### Installing

* `npm install swag-blog`

### Setup

Include swag and call it, passing in your Express app and options.
```javascript
var
  express = require('express'),
  swag    = require('swag-blog'),
  app     = express.createServer();

swag( app, {
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

### Methods

The methods autogenerate routes for individual posts, post lists, tags and categories. You can choose to use the generated routes, configure the generated routes, or just use your own. Each generator takes a route and a view file as their arguments.

* `createPostRoute('/post/:post', 'post')` creates a route for an individual post. Locals passed in are listed in *post locals*.
* `createPostListRoute('/posts/:page', 'postList')` creates a route for a paginated view of posts. Locals passed in are listed in *post list locals*
* `createTagRoute('/tag/:tag', 'tag')` creates a route for a listing of posts with specified tag. Locals passed in are listed in *tag locals*
* `createCategoryRoute('/category/:category', 'category')` creates a route for a listing of posts in the specified category. Locals passed in are listed in *category locals*

### Posts

Posts are constructed in markdown, prefixed by front matter via [YAML](https://github.com/mojombo/jekyll/wiki/YAML-Front-Matter) or [JSON](https://github.com/jsantell/node-json-front-matter). All attributes are stored into the post object.

### Local Variables in the View

The following variables are exposed to all views

* `allPosts` An array of all post objects in reverse-chronological order (details on post objects in Post View Params)
* `postCount` Total number of posts
* `allTags` An array of all tag name strings
* `allCategories` An array of all category name strings
* `getPosts( from, to )` get a subset of `posts`
* `pageCount` get a total number of pages
* `pageUrl( pageNum )` get a link to page `pageNum` of a post list
* `tagUrl( tag )` get a URL to the page of the tag view of `tag`
* `categoryUrl( cat )` get a URL to the page of the category view of `cat`

#### Post Locals

When on a specific post's page, all the post's metadata specified in the front-matter is exposed within the `post` object, as well as the following:

* `post.url` The url of the post
* `post.content` The body of the post
* `post.preview` The body of the post up to the first new line character

#### Post List Locals

When on a post list page 
* `posts` An array of all post objects that are within the current post range
* `page` The number of the current page

#### Tag Locals 

When on a tag page
* `posts` An array of all post objects that have the current tag
* `tag` A string of the current tag's name

#### Category Locals

When on a category list page
* `posts` An array of all post objects that belong to the current category
* `category` A string of the current category's name

### Development

To run tests, ensure you have Mocha installed `npm install mocha -g` and from the project root run `make test`
