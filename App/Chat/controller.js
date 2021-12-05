const Chat = require('./model');

module.exports = {
    Create: async (req, res) => {
        try {
            let chat = {};
            chat = await Chat.create(req.body);
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully added a chat',
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
            chat = await Chat.findOne({_id: id});
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
            let chat = {};
            await Chat.updateOne({_id: id}, {
                $set: req.body
            });
            chat = await Chat.findOne({_id: id});
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
    },
    ListByUser: async (req, res) => {
        try {
            let chats = [];
            chats = await Chat.find({
                $or: [
                    {
                        user: req.decoded._id
                    },
                    {
                        vendor: req.decoded._id
                    }
                ]
            });
            return res.status(200).json({
                status: 'Successful',
                chats: chats
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    }
}



