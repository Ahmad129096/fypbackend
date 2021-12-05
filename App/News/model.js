const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NewsModel = new Schema({
    title: {
        type: String,
        trim: true
    },
    cover: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    author: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('New', NewsModel);