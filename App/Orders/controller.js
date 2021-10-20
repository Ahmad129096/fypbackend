const Orders = require('./model');
const Products = require('../Products/model');

const Users = require('../Users/model');

const environment = require('dotenv');

environment.config();

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
    Create: async (req, res) => {
        try {
            let order = {}, user = {};
            const items = [];
            let amount = 0;
            req.body.items.forEach(item => {
                items.push({
                    product: item.product._id,
                    quantity: item.quantity
                });
                amount += item.product.price * item.quantity
            });
            user = await Users.findOne({ email: req.decoded._id });
            order = await Orders.create({
                items: items,
                user: user._id,
                amount: amount
            });
            req.body.items.forEach(async (item) => {
                await Products.updateOne({ _id: item.product._id }, {
                    $set: {
                        stock: item.product.stock - item.quantity
                    }
                });
            });

            let message = '<div style="display: flex; justify-content: center;">';
            message = '<div style="border-radius: 8px; background-color: #fff; padding: 20px 30px; text-align: center; box-shadow: 0px 9px 27px 0px rgba(0, 0, 0, 0.16); margin-top: 10px; max-width: 400px;">'
            message += '<h2 style="font-weight: 700; text-decoration: underline; text-align:center">Welcome to Perfume App</h2><br>';
            message += `<h3><b>Dear ${user.name}!</b></h3><br>` +
                `<p style="text-align: left;">Thank you for placing your order on Perfume App. Our team will process your order and contact you via email for further procedure.</p>`;
            message += '<br><p style="text-align: left;"><b>Regards:</b></p><br><p>PERFUME APP</p><br>';
            message += '</div>'

            const msg = {
                to: user.email,
                from: process.env.SENDER_EMAIL,
                subject: `PERFUME APP: Order Confirmation ${user.name}`,
                text: message,
                html: message
            };
            await sgMail.send(msg);

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
            const order = await Orders.findOne({_id: id});
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
                await Orders.updateOne({_id: id}, {
                    $set: req.body
                });
                let message = '';
                if (order.user.password) {
                    message = '<div style="display: flex; justify-content: center;">';
                    message = '<div style="border-radius: 8px; background-color: #fff; padding: 20px 30px; text-align: center; box-shadow: 0px 9px 27px 0px rgba(0, 0, 0, 0.16); margin-top: 10px; max-width: 400px;">'
                    message += '<h2 style="font-weight: 700; text-decoration: underline; text-align:center">Order Processing</h2><br>';
                    message += `<h3><b>Dear ${order.user.name}!</b></h3><br>` +
                        `<p style="text-align: left;">Kindly Login into your Dashboard to continue with payment procedure.</p>`;
                    message += '<br><p style="text-align: left;"><b>Regards:</b></p><br><p>FRUGAL PACKAGING</p><br>';
                    message += '</div>'
                }
                else {
                    message = '<div style="display: flex; justify-content: center;">';
                    message = '<div style="border-radius: 8px; background-color: #fff; padding: 20px 30px; text-align: center; box-shadow: 0px 9px 27px 0px rgba(0, 0, 0, 0.16); margin-top: 10px; max-width: 400px;">'
                    message += '<h2 style="font-weight: 700; text-decoration: underline; text-align:center">Order Processing</h2><br>';
                    message += `<h3><b>Dear ${order.user.name}!</b></h3><br>` +
                        `<p style="text-align: left;">Kindly visit this link and set your password to continue with your order procedure.</p>`;
                    message += `<a style="background-color: red; padding: 10px 20px; color: #fff; outline: none;" href="${process.env.USER_BASE_URL}/password/${order.user._id}?token=${order.user.token}" target="_blank">Click Here</a>`
                    message += '<br><p style="text-align: left;"><b>Regards:</b></p><br><p>FRUGAL PACKAGING</p><br>';
                    message += '</div>'
                }
                const msg = {
                    to: order.user.email,
                    from: process.env.SENDER_EMAIL,
                    subject: `PERFUME APP: Order Processing`,
                    text: message,
                    html: message
                };
                await sgMail.send(msg);
                return res.status(200).json({
                    status: 'Successful',
                    message: 'Email sent successfully to user to proceed for the order'
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
    }
}



