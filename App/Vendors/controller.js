const Vendors = require('./model');
const jwt = require("jsonwebtoken");

const bcrypt = require('bcryptjs');

module.exports = {
    Create: async (req, res) => {
        try {
            let vendor = {};
            let token = "";
            const { email, phoneNumber, username } = req.body;
            if (!email) {
                return res.status(404).json({
                    status: 'Failed',
                    errEmail: 'Email not supplied'
                });
            }
            if (!phoneNumber) {
                return res.status(404).json({
                    status: 'Failed',
                    errPhone: 'Phone Number not supplied'
                });
            }
            if (!username) {
                return res.status(404).json({
                    status: 'Failed',
                    errUsername: 'Username not supplied'
                });
            }
            vendor = await Vendors.findOne({ email: email }, { password: 0 });
            if (vendor) {
                return res.status(404).json({
                    status: 'Failed',
                    errEmail: 'Email already taken'
                });
            }
            vendor = await Vendors.findOne({ phoneNumber: phoneNumber }, { password: 0 });
            if (vendor) {
                return res.status(404).json({
                    status: 'Failed',
                    errPhone: 'Phone Number already taken'
                });
            }
            vendor = await Vendors.findOne({ username: username }, { password: 0 });
            if (vendor) {
                return res.status(404).json({
                    status: 'Failed',
                    errUsername: 'Username already taken'
                });
            }
            vendor = await Vendors.create(req.body);
            token = jwt.sign({ _id: vendor.id.toString() },
                process.env.TOKEN_SECRET
            );
            await Vendors.updateOne({ _id: vendor.id }, {
                token: token
            });
            vendor.token = token;
            vendor.password = undefined;
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully registered a vendor',
                data: vendor
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    },
    Login: async (req, res) => {
        try {
            const { email, password } = req.body;
            let vendor = {};
            vendor = await Vendors.findOne({ email: email });
            if (!vendor) {
                return res.status(403).json({
                    status: 'Failed',
                    message: 'Incorrect Email/Password'
                });
            }
            let isMatch = await vendor.comparePassword(password);
            if (!isMatch) {
                return res.status(403).json({
                    status: 'Failed',
                    message: 'Incorrect Email/Password'
                });
            }
            return res.status(200).json({
                status: 'Successful',
                data: vendor
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
            let vendor = {};
            const id = req.params.id;
            vendor = await Vendors.findOne({ _id: id }, { password: 0 });
            return res.status(200).json({
                status: 'Successful',
                data: vendor
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
            let vendor = {};
            await Vendors.updateOne({ _id: id }, {
                $set: req.body
            });
            vendor = await Vendors.findOne({ _id: id }, {
                password: 0
            });
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully updated vendor',
                data: vendor
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
            await Vendors.remove({ _id: id });
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully Deleted vendor'
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
            let vendors = [];
            vendors = await Vendors.find({});
            return res.status(200).json({
                status: 'Successful',
                data: vendors
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    },
    SetPassword: async (req, res) => {
        try {
            const id = req.params.id;
            let vendor  = await Vendors.findOne({_id: id});
            if (vendor.password) {
                return res.status(404).json({
                    status: 'Failed',
                    message: 'You already had set the password.'
                });
            }
            const password = await bcrypt.hash(req.body.newPassword, 8);
            const token = jwt.sign({ _id: vendor.id.toString() },
                process.env.TOKEN_SECRET
            );
            await Vendors.updateOne({_id: id}, {
                $set: {
                    password: password,
                    token: token
                }
            });
            vendor = await Vendors.findOne({_id: id}, { password: 0 });
            return res.status(200).json({
                status: 'Successful',
                message: 'Your password is set successfully.',
                data: vendor
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            })
        }
    }
}