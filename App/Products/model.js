const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductModel = new Schema({
    name:{
        type: String,
        trim: true,
        required: true
    },
    chineseName: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    chineseDescription: {
        type: String,
        trim: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    productCollection: {
        type: Schema.Types.ObjectId,
        ref: 'ProductCollection'
    },
    price:{
        type: String,
        trim: true
    },
    specs:[{
        type: String,
        trim: true
    }],
    chineseSpecs:[{
        type: String,
        trim: true
    }],
    cover: {
        type: String,
        trim: true
    },
    images: [{
        type: String,
        trim: true
    }],
    isDeleted:{
        type: Boolean,
        default: false
    },
    stock: {
        type: Number
    }
}, {
    timestamps: true
});

const autoPopulate = function (next) {
    this.populate('productCollection');
    this.populate('category');
    next();
}
ProductModel
      .pre('find', autoPopulate)
      .pre('findOne', autoPopulate)

module.exports = mongoose.model('Product', ProductModel);