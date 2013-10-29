var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Post = new Schema({
    title                   : { type : String, required: true },
    tags                    : [{ type : String}],
    category                : { type : String },
    template                : { type : String, enum : ['md', 'jade', 'markdown']},
    body                    : { type : String }
}, { collection: 'posts' });

/**
 * Returns all categories in array format, ignoring category ID
 */
Post.methods.render = function(callback){
    var self = this;

    var fmBlock = {title : self.title, tags : self.tags, category : self.category, date: self._id.getDate()};

    var fmBlockString = '{{' + JSON.stringify(fmBlock) + '}}';

    return fmBlockString + '\n' + self.body;
}

/**
 * Returns all tags in array format, ignoring tag ID
 */
function getAllTagsAsTextArray(callback){
    exports.Post.find({}).sort({title : 1}).exec(function(err, posts){
        if (err)
            return callback(err);

        var tagArray = [];

        posts.forEach(function(post){
            post.tags.forEach(function(tag){
                if (tagArray.indexOf(tag) === -1)
                    tagArray.push(tag);
            });
        });

        return callback(null, tagArray)
    })
}

/**
 * Returns all categories in array format, ignoring category ID
 */
function getAllCategoriesAsTextArray(callback){
    exports.Post.distinct('category').sort({category : 1}).exec(function(err, posts){
        if (err)
            return callback(err);

        return callback(null, posts.map(function(post){return post.category}));
    });
}


exports.Post = mongoose.model('Post', Post);
exports.Post.getAllTagsAsTextArray = getAllTagsAsTextArray;
exports.Post.getAllCategoriesAsTextArray = getAllCategoriesAsTextArray;
exports.Schema = Post;
