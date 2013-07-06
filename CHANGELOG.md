# Change Log

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
