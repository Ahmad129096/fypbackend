const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            default: 0
        }
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        default: 'Unpaid'
    },
    amount: {
        type: Number
    },
    transactionObject: {
        type: Object,
        default: {}
    }
}, {
    timestamps: true
});

const autoPopulate = function (next) {
    this.populate('items.product')
    this.populate('user')
    next();
}
OrderSchema
    .pre('find', autoPopulate)
    .pre('findOne', autoPopulate)

module.exports = mongoose.model('Order', OrderSchema);