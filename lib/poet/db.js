var Post = require('./schemas/post').Post,
    Tag = require('./schemas/tag').Tag,
    Category = require('./schemas/category').Category;

exports.getPostsFromDb = function(callback){
    Post.find({}.sort({_id : 1}).exec(callback));
}

exports.registerPostSaveMiddleware = function(poet, cb){
    Post.post('save', function(){
        poet.init();
        return cb();
    });
})


exports.getTags = function() {
    return Tag.getAllTagsAsTextArray();
}

exports.getCategories = function() {
    return Category.getAllCategoriesAsTextArray();
}

