const Collections = require('./model');


module.exports = {
    Create: async (req, res) => {
        try {
            let collection = {};
            collection = await Collections.create(req.body);
    
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully registered a collection',
                data: collection
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
            let collection = {};
            const id = req.params.id;
            collection = await Collections.findOne({_id: id});
            if(collection.isDeleted) {
                return res.status(403).json({
                    status: "Failed",
                    message: "No such collection exist"
                })
            }
            return res.status(200).json({
                status: 'Successful',
                data: collection
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
            await Collections.updateOne({_id: id}, {
                $set: req.body
            });
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully updated collection'
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
            await Collections.updateOne({_id: id},{
                $set:{
                    isDeleted: true
                }
            });
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully Deleted collection'
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
            let collections = [];
            collections = await Collections.find({
                isDeleted: false
            });
            return res.status(200).json({
                status: 'Successful',
                data: collections
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    }
}



