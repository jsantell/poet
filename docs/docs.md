## What is Poet?
<a href="http://github.com/jsantell/poet" title="Poet">**Poet**</a> is a blog generator in <a href="http://nodejs.org" title="node.js">node.js</a> to generate routing, render markdown/jade/whatever posts, and get a blog up and running *fast*. Poet may not make you blog-famous, and it may give you one less excuse for not having a blog, but just imagine the insane hipster cred you get for having node power your blog. *"Cool blog, is this Wordpress or something?"* your square friend asks. *"Nah dude, this is in node,"* you respond, while skateboarding off into the sunset, doing mad flips and stuff. Little do they know you just used Poet's autoroute generation to get your content in, like, seconds, up on that internet.

## Getting Started
First thing first, throw **Poet** into your express app's package.json, or just install it locally with:

<pre>
npm install poet
</pre>

Once you have the **Poet** module in your app, just instantiate an instance with your Express app and options, and call the `init` method:

<pre>
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
</pre>

If using Express 3, be sure to use Poet version <= `1.1.0`. For Express 4+, use Poet `2.0.0+`.

## Posts

Posts are constructed in [markdown](http://daringfireball.net/projects/markdown/)/[jade](http://jade-lang.com/)/[whatever-you-want](#Templates), prefixed by front matter via [YAML](https://github.com/mojombo/jekyll/wiki/YAML-Front-Matter) or [JSON](https://github.com/jsantell/node-json-front-matter). All attributes are stored in the posts object. An example of a blog post formatted with JSON Front Matter is below:

<pre>
{{{
  "title": "Hello World!",
  "tags": ["blog", "fun"],
  "category": "javascript",
  "date": "7-29-2013"
}}}

Here goes the content that belongs to the post...
</pre>

### Post Previews

There are several ways of specifying the text of your post preview. **Poet** checks several properties and the first valid option is used. The order and ways to accomplish this are below.

* A `preview` property on a post. The text of this property runs through the appropriate template and be saved as the preview for a post
* A `previewLength` property on a post, which will take the first `n` characters of your post (before running through a templating engine), becoming your preview.
* The last, and most likely easiest, is specifying a `readMoreTag` option in your **Poet** configuration, which by default is `<!--more-->`. Whenever the `readMoreTag` is found int he post, anything proceeding it becomes the preview. You can set this globally in your **Poet** config, or specify a `readMoreTag` property for each post individually


## Options

* `posts` path to directory of your files of posts (default: `./\_posts/`)
* `metaFormat` format of your front matter on every blog post. Can be `yaml` or `json` (default: `json`)
* `postsPerPage` How many posts are displayed per page in the page route (default: `5`)
* `readMoreLink` A function taking the post object as the only parameter, returning a string that is appended to the post's preview value. By default will be a function returning `<a href="{post.link}">{post.title}</a>`
* `readMoreTag` A string in a post that is rendered as a read more link when parsed. (default: `<!--more-->`)
* `showDrafts` An option on whether or not to display posts that have `drafts` meta set to true (default: `process.env.NODE\_ENV !== 'production'`)
* `routes` A hash of route keys (ex: `'/post/:post'` and the related view file (ex: `'post'`). More information in the [routes](#Routes) section below.

## Methods

### Poet::init([callback])

The `init` method traverses the directory of posts and stores all the information in memory, sets up the internal structures for retrieval and returns a promise resolving to the instance upon completion. An optional callback may be provided for a node style callback with `err` and `poet` arguments passed in, called upon completion. This is used when initializing the application, or if reconstructing the internal storage is needed.

### Poet::watch([callback])

Sets up the **Poet** instance to watch the posts directory for changes (a new post, updated post, etc.) and reinitializes the engine and storage. An optional `callback` may be provided to signify the completion of the reinitialization.

For an example of using `watch`, check out [the watcher example](https://github.com/jsantell/poet/blob/master/examples/watcher.js)

### Poet::unwatch()

Removes all watchers currently bound to the **Poet** instance.

### Poet::clearCache()

Used internally, this clears the **Poet** instance's internal cache, allowing it to be rebuilt on it's next use. This should not be used in most cases. Returns the **Poet** instance.
<h3 id="Templates">Poet::addTemplate(data)</h3>

**Poet** comes with two templating engines by default (jade and markdown). To specify your own templating language, the `addTemplate` method may be used, taking a `data` object with two keys: `ext` and `fn`. `ext` may be a string or an array of strings, specifiying which extensions should use this templating engine, and `fn` does the rendering, where it is a function that passes an object with several properties: `source`, `filename` and `locals` for rendering engine local variables, and returns the formatted string. Here's an example of using your own YAML formatter:

<pre>
var
  express = require('express'),
  app = express(),
  yaml = require('yaml'),
  Poet = require('poet');

var poet = Poet(app);

poet.addTemplate({
  ext: 'yaml',
  fn : function (options) { return yaml.eval(options.source); }
}).init();
</pre>

This runs any post with the file extension `yaml` (ex: `my_post.yaml`) through the `fn` specified (by calling the `yaml` module's `eval` method.

### Poet::addRoute(route, handler)

`addRoute` allows you to specify the handler for a specific route type. Accepting a `route` string (ex: '/myposts/:post') and a function `handler`, the route is parsed based off of parameter name (`:post` for example in the route `/myposts/:post`), and the previously stored route for that route type (post) is replaced.

The below example uses all default routes except for the post route, and gives full control over how the request is handled. Obviously extra code is needed to specify this, but we can add arbitrary code here, for example, to do some sort of logging:

<pre>
var
  express = require('express'),
  app = express(),
  Poet = require('poet');

var poet = Poet(app);

poet.addRoute('/myposts/:post', function (req, res, next) {
  var post = poet.helpers.getPost(req.params.post);
  if (post) {
    // Do some fancy logging here
    res.render('post', { post: post });
  } else {
    res.send(404);
  }
}).init();
</pre>

For more examples on custom routing, check out the [examples in the repository](https://github.com/jsantell/poet/blob/master/examples/customRoutes.js).

## Routing

The default configuration uses the default routes with the view names below:

* '/post/:post': 'post'
* '/page/:page': 'page'
* '/tag/:tag': 'tag'
* '/category/:category': 'category'

For example, if your site root is `http://mysite.com`, going to the page `http://mysite.com/post/hello-world` will call the 'post' view in your view directory and render the appropriate post. The options passed into the instantiation of the **Poet** instance can have a `routes` key, with an object containing key/value pairs of strings mapping a route to a view. Based off of the paramter in the route (ex: `:post` in `/post/:post`), the previous route will be replaced.

For an example of customizing your route names and views, view the [example in the repository](https://github.com/jsantell/poet/blob/master/examples/configuredSetup.js). To override the default handlers of, check out the `Poet::addRoute(route, handler)` method.

## Helpers

Built in helper methods are stored on the **Poet** instance's `helper` property. Used internally, and in the view locals, they can be used outside of **Poet** as well.

* `getPosts(from, to)` - an array of reverse chronologically ordered post objects. May specify `from` and `to` based on their index, to limit which posts should be returned.
* `getTags()` - an array of tag names
* `getCategories` - an array of category names
* `tagURL(tag)` - a function that takes a name of a tag and returns the corresponding URL based off of the routing configuration
* `pageURL(page)` - a function that takes the number of a page and returns the corresponding URL based off of the routing configuration
* `categoryURL(category)` - a function that takes a name of a category and returns the corresponding URL based off of the routing configuration
* `getPostCount()` - a function that returns the number of total posts registered
* `getPost(title)` - a function that returns the corresponding post based off of `title`
* `getPageCount()` - a function that returns the total number of pages, based off of number of posts registered and the `postsPerPage` option.
* `postsWithTag(tag)` - returns an array of posts that contain `tag`
* `postsWithCategory(cat)` - returns an array of posts are in category `cat
* `options` - all of the option configurations

## Locals

In addition to all of the helpers being available to each view, there are additional variables accessible inside specific views.

### Post Locals

* `post.url` - the URL of the current post
* `post.content` - the content of the current post
* `post.preview` - the preview of the current post

### Page Locals

* `posts` - an array of post objects that are within the current post range
* `page` - the number of the current page

### Tag Locals

* `posts` - an array of all post objects that contain the current tag
* `tag` - a string of the current tag's name

### Category Locals

* `posts` - an array of all post objects with the current category
* `category` - a string of the current category's name

## Additional Examples

Be sure to check out the examples in the repository

* [Default configuration](https://github.com/jsantell/poet/blob/master/examples/defaultSetup.js)
* [Specifying some options](https://github.com/jsantell/poet/blob/master/examples/configuredSetup.js)
* [Using your own custom routes](https://github.com/jsantell/poet/blob/master/examples/customRoutes.js)
* [Setting up an RSS feed](https://github.com/jsantell/poet/blob/master/examples/rss.js)
* [Using a watcher](https://github.com/jsantell/poet/blob/master/examples/watcher.js)

## Get Bloggin'!

Time to start writing your sweet, beautiful words. For more development information, check out the [repository](https://github.com/jsantell/poet), or scope out the examples in there to get a better idea. If you have any comments, questions, or suggestions, hit me up [@jsantell](http://twitter.com/jsantell)!
