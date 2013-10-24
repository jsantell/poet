var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Post = new Schema({
    title                   : { type : String, required: true },
    tags                    : { type : ObjectId, reference : 'Tag'},
    category                : { type : ObjectId, reference : 'Category'},
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


exports.Post = mongoose.model('Post', Post);
exports.Schema = Post;
