const Chat = require('./model');

const bcrypt = require('bcryptjs');

module.exports = {
    Create: async (req, res) => {
        try {
            let chat = {};
            chat = await Chat.create(req.body);
    
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully registered a chat',
                data: chat
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
            let chat = {};
            const id = req.params.id;
            chat = await Chat.findOne({_id: id}, {password: 0});
            return res.status(200).json({
                status: 'Successful',
                data: chat
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
            chat = await Chat.findOneAndUpdate({_id: id}, {
                $set: req.body
            });
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully updated chat',
                data: chat
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
            await Chat.remove({_id: id});
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully Deleted chat'
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
            let chats = [];
            chats = await Chat.find({});
            return res.status(200).json({
                status: 'Successful',
                data: chats
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    }
}



