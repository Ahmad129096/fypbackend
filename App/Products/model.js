const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductModel = new Schema({
    vendor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor'
    },
    name:{
        type: String,
        trim: true,
        required: true
    },
    shortDescription: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    subCategory: {
        type: Schema.Types.ObjectId,
        ref: 'SubCategory'
    },
    productCollection: {
        type: Schema.Types.ObjectId,
        ref: 'ProductCollection'
    },
    price:{
        type: Number
    },
    specs:[{
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
    },
    ratings: {
        users: [{
            type: String,
            trim: true
        }],
        value: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});

const autoPopulate = function (next) {
    this.populate('productCollection');
    this.populate('category');
    this.populate('subCategory');
    this.populate('vendor');
    next();
}
ProductModel
      .pre('find', autoPopulate)
      .pre('findOne', autoPopulate)

module.exports = mongoose.model('Product', ProductModel);