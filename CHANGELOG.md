# Change Log

## v2.0.1

* Added Support scheduled posts.

## v2.0.0

* Now depending on Express 4.0.0+, issue #102, no longer supports Express v3.

## v1.0.0

* Fixed some issues with allow Express 4.0.0+ in tests and examples 2816f43a68e04714bf28a838cb618e7cf5517a68, 57eba690d1a4e1b07a1d1c2b6fbb82e7c062cdca
* Render helpful errors in posts that have template errors, and hide posts with template errors in production, issue #82
* Expose additional properties to template functions, issue #81 
* Add method `unwatch` to remove all current watchers, issue #68 

## v1.0.0-rc4
* :warning: The `routes` configuration option during instantiation will no longer create routes that are not explicitly defined, unless using defaults, issue #71
  * Leaving `routes` as empty will continue to use the default routing.
  * Setting `routes` to `null` will not set any routes.
  * Setting `routes` to an object will only define routes specified in that object. Therefore, using an empty object will not set any routes.
* :warning: Post slugs are now created from the `title` attribute instead of the file name. Slugs can also be customized by adding a `slug` attribute in a post, issue #64, issue #69
* Bake version of `marked` and `json-front-matter` to be consistent with previous versions -- can include newer versions with custom templating.
* Handles errors more gracefully when posts cannot compile with their template, issue #61

## v1.0.0-rc3

* Added async templating processing, issue #50
* Fixed hiding drafts in helper functions, issue #54, issue #48
* Option `showFuture` to hide posts scheduled for the future, issue #47

## v1.0.0-rc2

* Added a 'next()' fallback for the auto page route, issue #45 
* Allow users to specify their own options to be included in `poet.options`, issue #37,
* Fixed an issue where calling `addRoute` with an invalid route misbehaves, issue #38 

## v1.0.0rc1

Check out the examples directory for updated uses of the changes.

* `require('poet')` now returns a constructor (`new` is not needed). The constructor takes an Express app argument and an options argument. All methods are now performed on the resulting instance, rather than the global Poet object.
* **Auto updating now possible!** The `watch` method has been added to auto update poet on any post change.
* `init` method now returns a promise for the completion of the reinitialization. It also still accepts a callback.
* `set` has been removed -- options are passed in during instantiation.
* All route creation methods (`createPostRoute`, `createPageRoute`, `createTagRoute`, `createCategoryRoute`) have been removed and created on instantiation. The `routes` option in configuration may be used instead.
* `addRoute` method has been added to define a custom route.
* `middleware` has been removed. This can be achieved by using the instance's `helper` properties which contain all the previous helpers/locals.
* Several locals/helpers have been renamed:
  * `pageUrl` is now `pageURL`
  * `tagUrl` is now `tagURL`
  * `categoryUrl` is now `categoryURL`
  * `sortedPostsWithCategory` is now `postsWithCategory`
  * `sortedPostsWithTag` is now `postsWithTag`
* Several helpers have been removed and turned into functions
  * `postList` can now be retrieved via `getPosts()`
  * `tagList` can now be retrieved via `getTags()`
  * `categoryList` can now be retrieved via `getCategories()`
