const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const UserModel = new Schema({
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    username: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    dob: {
        type: String,
        trim: true
    },
    token: {
        type: String,
        trim: true
    },
    name: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true
    },
    houseNumber: {
        type: String,
        trim: true
    },
    appartment: {
        type: String,
        trim: true
    },
    postalCode: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    total: {
        type: Number,
        trim: true
    },
    cardNumber:
    {
        type: Number,
        trim: true
    },
    cardHolder: {
        type: String,
        trim: true
    },
    cardExpire: {
        type: String,
        trim: true
    },
    cvc: {
        type: Number,
        trim: true
    },
    address: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

UserModel.pre('save', async function (next) {
    if (this.password) {
        let newPassword = await bcrypt.hash(this.password, 8);
        this.password = newPassword;
    }
    next();
});

UserModel.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
}

module.exports = mongoose.model('User', UserModel);