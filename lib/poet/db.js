var Post = require('./schemas/post').Post;

exports.getPostsFromDb = function(callback){
    Post.find({}).sort({_id : 1}).exec(function(err, posts){
        callback(null, posts.map(function(post){ return post.render()}));
    });
}

exports.registerPostSaveMiddleware = function(poet, cb){
    Post.post('save', function(){
        poet.init();
        return cb();
    });
}


exports.getTags = function() {
    return Post.getAllTagsAsTextArray();
}

exports.getCategories = function() {
    return Post.getAllCategoriesAsTextArray();
}

