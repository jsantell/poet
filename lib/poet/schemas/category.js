var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var Category = new Schema({
    title                   : { type : String, required: true }
}, { collection: 'categories' })

Category.methods.render = function(){
    return this.title;
}

/**
 * Returns all categories in array format, ignoring category ID
 */
function getAllCategoriesAsTextArray(callback){
    exports.Category.find({}).sort({title : 1}).exec(function(err, categories){
        if (err)
            return callback(err)

        return categories.map(function(cat){return cat.render()})
    })
}

exports.Category = mongoose.model('Category', Category)
exports.Category.getAllCategoriesAsTextArray = getAllCategoriesAsTextArray
exports.Schema = Category
