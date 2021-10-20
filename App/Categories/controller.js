const Category = require('./model');


module.exports = {
    Create: async (req, res) => {
        try {
            let category = {};
            category = await Category.create(req.body);
    
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully registered a category',
                data: category
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
            let category = {};
            const id = req.params.id;
            category = await Category.findOne({_id: id});
            if(category.isDeleted) {
                return res.status(403).json({
                    status: "Failed",
                    message: "No such category exist"
                })
            }
            return res.status(200).json({
                status: 'Successful',
                data: category
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
            await Category.updateOne({_id: id}, {
                $set: req.body
            });
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully updated category'
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
            await Category.updateOne({_id: id},{
                $set:{
                    isDeleted: true
                }
            });
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully Deleted category'
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
            let categories = [];
            categories = await Category.find({
                isDeleted: false
            });
            return res.status(200).json({
                status: 'Successful',
                data: categories
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    }
}



