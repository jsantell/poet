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
  route: '/blog/'
});
```

#### Options

* `posts` path to directory of your markdown files of posts (default: `./\_posts/`)

* `postView` view file to use for posts (default: `post`)
* `postListView` view file to use for post lists (default: `list`)
* `tagView` view file to use for tag view (default: `tag`)
* `categoryView` view file to use for category view (default: `category`)

* `postRoute` route to be prefixed to post name, like `http://yourblog.com/post/hello-world` (default: `/post/`)
* `postListRoute` route to be prefixed to post list, like `http://yourblog.com/post/3` for third page of list (default: `/posts/`)
* `tagRoute` route to be prefixed to post list, like `http://yourblog.com/tag/node` for list of posts of tag 'node' (default: `/tag/`)
* `categoryRoute` route to be prefixed to category post list, like `http://yourblog.com/category/plugins` for category of 'plugins' (default: `/category/`)

* `postsPerPage` number of posts per page if you use pagination or list views (default: `5`)
* `metaFormat` Format of the metadata in your posts, either `yaml` or `json` (default: `json`)

### Posts

Posts are constructed in markdown, prefixed by front matter via [YAML](https://github.com/mojombo/jekyll/wiki/YAML-Front-Matter) or [JSON](https://github.com/jsantell/node-json-front-matter). All attributes are passed into the view template, with reserved Express attributes (`layout`, `status`) affecting Express rendering.
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

#### Tag Locals 

When on a tag page
* `posts` An array of all post objects that have the current tag
* `tag` A string of the current tag's name

#### Post List Locals

When on a post list page 
* `posts` An array of all post objects that are within the current post range
* `page` The number of the current page

#### Category Locals

When on a category list page
* `posts` An array of all post objects that belong to the current category
* `category` A string of the current category's name

### TODO

Right now all the post data is stored in memory for quick serving -- a caching option (Jekyll-style) for larger sites wouldn't be a terrible idea.
