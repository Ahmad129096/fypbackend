const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategoryModel = new Schema({
    name:{
        type: String,
        trim: true,
        required: true
    },
    chineseName: {
        type: String,
        trim: true
    },
    isDeleted:{
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});



module.exports = mongoose.model('Category', CategoryModel);