const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const AgentUserModel = new Schema({
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    role: {
        type: String,
        default: 'agent'
    },
    name: {
        type: String,
        trim: true
    },

    password: {
        type: String,
        trim: true
    },
    token: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});
AgentUserModel.pre('save', async function (next) {
    const newPaswword = await bcrypt.hash(this.password, 8);
    this.password = newPaswword;
    next();
});

AgentUserModel.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
}

module.exports = mongoose.model('AgentUser', AgentUserModel);