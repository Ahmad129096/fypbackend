const Messages = require('./model');

const Chats = require('../Chat/controller');

module.exports = {
    Create: async (req, res) => {
        try {
            let messages = {};
            messages = await Messages.create(req.body);
            await Chats.updateOne({
                _id: req.body.chatId
            }, {
                $push: {
                    messages: messages
                }
            });
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully registered a messages',
                data: messages
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
            let messages = {};
            const id = req.params.id;
            messages = await Messages.findOne({ _id: id }, { password: 0 });
            return res.status(200).json({
                status: 'Successful',
                data: messages
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
            messages = await Messages.findOneAndUpdate({ _id: id }, {
                $set: req.body
            });
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully updated messages',
                data: messages
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
            await Chats.updateOne({ messages: id }, {
                $pull: {
                    messages: id
                }
            });
            await Messages.remove({ _id: id });
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully Deleted messages'
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
            let messages = [];
            messages = await Messages.find({});
            return res.status(200).json({
                status: 'Successful',
                data: messages
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    }
}
