const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ChatModel = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    agent: {
        type: Schema.Types.ObjectId,
        ref: 'AgentUser'
    },
    messages: {
        type: Schema.Types.ObjectId,
        ref: 'Messages'
    }
}, {
    timestamps: true
});

const autoPopulate = function (next) {
    this.populate('agent');
    this.populate('user');
    this.populate('messages');
    next();
}
ChatModel
    .pre('find', autoPopulate)
    .pre('findOne', autoPopulate)


module.exports = mongoose.model('Chat', ChatModel);