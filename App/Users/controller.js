const Users = require('./model');
const jwt = require("jsonwebtoken");
const emailvalidator = require("email-validator");

const bcrypt = require('bcryptjs');

module.exports = {
    Create: async (req, res) => {
        try {
            let user = {};
            let token = "";
            
            const { email, phoneNumber, username } = req.body;
            if (!email) {
                return res.status(404).json({
                    status: 'Failed',
                    errEmail: 'Email not supplied'
                });
            }
            if(!emailvalidator.validate(email))
            {
                return res.status(404).json({
                    status: 'Failed',
                    errEmail: 'Invalid Email'
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
            user = await Users.findOne({ email: email }, { password: 0 });
            if (user) {
                return res.status(404).json({
                    status: 'Failed',
                    errEmail: 'Email already taken'
                });
            }
            user = await Users.findOne({ phoneNumber: phoneNumber }, { password: 0 });
            if (user) {
                return res.status(404).json({
                    status: 'Failed',
                    errPhone: 'Phone Number already taken'
                });
            }
            user = await Users.findOne({ username: username }, { password: 0 });
            if (user) {
                return res.status(404).json({
                    status: 'Failed',
                    errUsername: 'Username already taken'
                });
            }

            user = await Users.create(req.body);
            token = jwt.sign({ _id: user.id.toString() },
                process.env.TOKEN_SECRET
            );
            await Users.updateOne({ _id: user.id }, {
                token: token
            });
            user.token = token;
            user.password = undefined;
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully registered a user',
                data: user
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
            let user = {};
            user = await Users.findOne({ email: email });
            if (!user) {
                return res.status(403).json({
                    status: 'Failed',
                    message: 'Incorrect Email/Password'
                });
            }
            let isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(403).json({
                    status: 'Failed',
                    message: 'Incorrect Email/Password'
                });
            }
            return res.status(200).json({
                status: 'Successful',
                data: user
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
            let user = {};
            const id = req.params.id;
            user = await Users.findOne({ _id: id }, { password: 0 });
            return res.status(200).json({
                status: 'Successful',
                data: user
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
            let user = {};
            await Users.updateOne({ _id: id }, {
                $set: req.body
            });
            user = await Users.findOne({ _id: id }, {
                password: 0
            });
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully updated user',
                data: user
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
            await Users.remove({ _id: id });
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully Deleted user'
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
            let users = [];
            users = await Users.find({});
            return res.status(200).json({
                status: 'Successful',
                data: users
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
            let user  = await Users.findOne({_id: id});
            if (user.password) {
                return res.status(404).json({
                    status: 'Failed',
                    message: 'You already had set the password.'
                });
            }
            const password = await bcrypt.hash(req.body.newPassword, 8);
            const token = jwt.sign({ _id: user.id.toString() },
                process.env.TOKEN_SECRET
            );
            await Users.updateOne({_id: id}, {
                $set: {
                    password: password,
                    token: token
                }
            });
            user = await Users.findOne({_id: id}, { password: 0 });
            return res.status(200).json({
                status: 'Successful',
                message: 'Your password is set successfully.',
                data: user
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            })
        }
    }
    
    
}