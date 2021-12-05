const Orders = require('./model');
const Products = require('../Products/model');

const Users = require('../Users/model');

const environment = require('dotenv');

environment.config();

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

module.exports = {
    Create: async (req, res) => {
        try {
            let order = {}, user = {};
            const items = [];
            let amount = 0;
            for (const item of req.body.items) {
                const product = await Products.findOne({_id: item.productId});
                items.push({
                    product: item.productId,
                    quantity: item.quantity
                });
                amount += product.price * item.quantity
            }
            user = await Users.findOne({ _id: req.decoded._id });
            order = await Orders.create({
                items: items,
                user: user._id,
                amount: amount
            });
            for (const item of req.body.items) {
                const product = await Products.findOne({_id: item.productId});
                await Products.updateOne({ _id: item.productId }, {
                    $set: {
                        stock: product.stock - item.quantity
                    }
                });   
            }
            return res.status(200).json({
                status: 'Successful',
                message: 'Order successfully placed',
                data: order
            });

        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    },
    Read: async (req, res) => {
        try {
            let order = {};
            const id = req.params.id;
            order = await Orders.findOne({ _id: id });
            return res.status(200).json({
                status: 'Successful',
                data: order
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    },
    Update: async (req, res) => {
        try {
            const id = req.params.id;
            await Orders.updateOne({ _id: id }, {
                $set: req.body
            });
            const order = await Orders.findOne({ _id: id });
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully updated order',
                data: order
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    },
    Delete: async (req, res) => {
        try {
            const id = req.params.id;
            await Orders.remove({ _id: id });
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully Deleted order'
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    },
    List: async (req, res) => {
        try {
            let orders = [];
            orders = await Orders.find({});
            return res.status(200).json({
                status: 'Successful',
                data: orders
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    },
    ProceedOrder: async (req, res) => {
        try {
            const id = req.params.id;
            const order = await Orders.findOne({ _id: id });
            if (order) {
                req.body.status = 'Paid'
                await Orders.updateOne({ _id: id }, {
                    $set: req.body
                });
                return res.status(200).json({
                    status: 'Successful',
                    message: 'Your order has been successfully placed.'
                });
            } else {
                return res.status(403).json({
                    status: 'Not Found',
                    message: 'No such order'
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            })
        }
    },
    Pay: async (req, res) => {
        try {
            const id = req.params.id;
            let order = {};
            order = await Orders.findOne({_id: id});
            if ( !order ) {
                return res.status(403).json({
                    status: 'Failed',
                    message: 'No such order exist'
                });
            }
            const payment = await stripe.charges.create({
                amount: order.amount * 100,
                description: 'Paying for FYP E-commerce for order ID: ' + id,
                currency: 'usd',
                source: req.body.token
            });
            await Orders.updateOne({ _id: id }, {
                $set: {
                    transactionObject: payment,
                    status: 'Paid'
                }
            });
            order = await Orders.findOne({_id: id});
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully payed for your order',
                data: order
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    }
}



