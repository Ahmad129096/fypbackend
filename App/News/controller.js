const News = require('./model');

module.exports = {
    Create: async (req, res) => {
        try {
            let news = {};
            news = await News.create(req.body);
    
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully registered a news',
                data: news
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
            let news = {};
            const id = req.params.id;
            news = await News.findOne({_id: id});
            return res.status(200).json({
                status: 'Successful',
                data: news
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
            let news = {};
            await News.updateOne({_id: id}, {
                $set: req.body
            });
            news = await News.findOne({_id: id});
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully updated news',
                data: news
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
            await News.remove({_id: id});
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully Deleted news'
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
            let news = [];
            news = await News.find({});
            return res.status(200).json({
                status: 'Successful',
                data: news
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    }
}



