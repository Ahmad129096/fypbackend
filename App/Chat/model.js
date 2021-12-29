const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ChatModel = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    vendor: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Messages'
    }]
}, {
    timestamps: true
});

const autoPopulate = function (next) {
    this.populate('vendor', '-password');
    this.populate('user', '-password');
    this.populate('messages');
    next();
}
ChatModel
    .pre('find', autoPopulate)
    .pre('findOne', autoPopulate)


module.exports = mongoose.model('Chat', ChatModel);