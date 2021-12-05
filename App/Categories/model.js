const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategoryModel = new Schema({
    name:{
        type: String,
        trim: true,
        required: true
    },
    isDeleted:{
        type: Boolean,
        default: false
    },
    subCategories: [{
        type: Schema.Types.ObjectId,
        ref: 'SubCategory'
    }]
}, {
    timestamps: true
});

const autoPopulate = function (next) {
    this.populate('subCategories');
    next();
}
CategoryModel
      .pre('find', autoPopulate)
      .pre('findOne', autoPopulate)


module.exports = mongoose.model('Category', CategoryModel);