var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var Tag = new Schema({
    title                   : { type : String, required: true }
}, { collection: 'tags' })

exports.Tag.render = function(){
    return this.title;
}

/**
 * Returns all tags in array format, ignoring tag ID
 */
function getAllTagsAsTextArray(callback){
    exports.Tag.find({}).sort({title : 1}).exec(function(err, tags){
        if (err)
            return callback(err)

        return tags.map(function(tag){return tag.render()})
    })
}

exports.Tag = mongoose.model('Tag', Tag)
exports.Tag.getAllTagsAsTextArray = getAllTagsAsTextArray
exports.Schema = Tag
