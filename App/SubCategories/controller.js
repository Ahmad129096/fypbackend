const SubCategory = require('./model');
const Category = require('../Categories/model');

module.exports = {
    Create: async (req, res) => {
        try {
            let subCategory = {};
            subCategory = await SubCategory.create(req.body);
            await Category.updateOne({_id: req.body.categoryId}, {
                $push: {
                    subCategories: subCategory.id
                }
            });
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully added a Sub Category',
                data: subCategory
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
            let subCategory = {};
            const id = req.params.id;
            subCategory = await SubCategory.findOne({_id: id});
            if(subCategory.isDeleted) {
                return res.status(403).json({
                    status: "Failed",
                    message: "No such Sub Category exist"
                })
            }
            return res.status(200).json({
                status: 'Successful',
                data: subCategory
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
            await SubCategory.updateOne({_id: id}, {
                $set: req.body
            });
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully updated Sub Category'
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
            await SubCategory.updateOne({_id: id},{
                $set:{
                    isDeleted: true
                }
            });
            await Category.updateOne({ subCategories: id }, {
                $pull: {
                    subCategories: id
                }
            });
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully Deleted Sub Category'
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
            let subCategories = [];
            subCategories = await SubCategory.find({
                isDeleted: false
            });
            return res.status(200).json({
                status: 'Successful',
                data: subCategories
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    }
}