const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const AdminUserModel = new Schema({
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    role: {
        type: String,
        default: 'admin'
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
AdminUserModel.pre('save', async function (next) {
    const newPaswword = await bcrypt.hash(this.password, 8);
    this.password = newPaswword;
    next();
});

AdminUserModel.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
}

module.exports = mongoose.model('AdminUser', AdminUserModel);