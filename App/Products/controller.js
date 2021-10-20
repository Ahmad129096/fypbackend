const Product = require('./model');



module.exports = {
    Create: async (req, res) => {
        try {
            let product = {};
            product = await Product.create(req.body);
    
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully registered a product',
                data: product
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
            let product = {};
            const id = req.params.id;
            product = await Product.findOne({_id: id});
            if(product.isDeleted) {
                return res.status(403).json({
                    status: "Failed",
                    message: "No such product exist"
                });
            }
            return res.status(200).json({
                status: 'Successful',
                data: product
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
            product = await Product.findOneAndUpdate({_id: id}, {
                $set: req.body
            });
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully updated product',
                data: product
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
            await Product.updateOne({_id: id}, {
                $set:{
                    isDeleted: true
                }
            });
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully Deleted product'
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
            let products = [];
            products = await Product.find({
                isDeleted: false
            });
            return res.status(200).json({
                status: 'Successful',
                data: products
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    },
    ProductForHome: async (req, res) => {
        try {
            let topSellings = [], newArrivals = [], uniqueProducts = [];
            topSellings = await Product.find({type: 'Top Selling'});
            newArrivals = await Product.find({type: 'New Arrivals'});
            uniqueProducts = await Product.find({type: 'Unique Products'});
            return res.status(200).json({
                status: 'Successful',
                data: {
                    topSellings: topSellings,
                    newArrivals: newArrivals,
                    uniqueProducts: uniqueProducts
                }
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    },
    ProductsByCategory: async (req, res) => {
        try {
            let products = [];
            products = await Product.find({category: req.query.category});
            return res.status(200).json({
                status: 'Successful',
                data: products
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    }
}




