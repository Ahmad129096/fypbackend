const Product = require('./model');

module.exports = {
    Create: async (req, res) => {
        try {
            let product = {};
            req.body.user = req.decoded._id;
            product = await Product.create(req.body);
    
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully registered a Pet',
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
                    message: "No such Pet exist"
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
            let product = {};
            await Product.updateOne({_id: id}, {
                $set: req.body
            });
            product = await Product.findOne({_id: id});
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully updated Pet',
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
                message: 'Successfully Deleted Pet'
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
            uniqueProducts = await Product.find({type: 'Unique Pets'});
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
    },
    ProductsBySubCategory: async (req, res) => {
        try {
            let products = [];
            products = await Product.find({subCategory: req.query.subCategory});
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
    ProductsByVendor: async (req, res) => {
        try {
            const id = req.params.id;
            let products = [];
            products = await Product.find({user: id});
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
    AdvanceSearch: async (req, res) => {
        try {
            let {
                category,
                subCategory,
                user,
                minPrice,
                maxPrice,
                minRating,
                maxRating
            } = req.query;
            
            let products = [];
            let queryObject = {};

            minPrice = parseFloat(minPrice);
            maxPrice = parseFloat(maxPrice);
            minRating = parseFloat(minRating);
            maxRating = parseFloat(maxRating);

            if (category) {
                queryObject.category = category;
            }
            if (subCategory) {
                queryObject.subCategory = subCategory;
            }
            if (user) {
                queryObject.user = user;
            }
            if (minPrice && maxPrice) {
                queryObject.price = {
                    '$gte': minPrice,
                    '$lte': maxPrice
                }
            } else if (maxPrice) {
                queryObject.price = {
                    '$lte': maxPrice
                }
            } else if (minPrice) {
                queryObject.price = {
                    '$gte': minPrice
                }
            }
            if (minRating && maxRating) {
                queryObject = {
                    ...queryObject,
                    'ratings.value': {
                        '$gte': minRating,
                        '$lte': maxRating
                    }
                }
            } else if (maxRating) {
                queryObject = {
                    ...queryObject,
                    'ratings.value': {
                        '$lte': maxRating
                    }
                }
            } else if (minRating) {
                queryObject = {
                    ...queryObject,
                    'ratings.value': {
                        '$gte': minRating
                    }
                }
            }
            products = await Product.find(queryObject);
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
    Ratings: async (req, res) => {
        try {
            let product = {};
            product = await Product.findOne({
                'ratings.users': req.decoded._id
            });
            if (product) {
                await Product.updateOne({_id: req.params.id}, {
                    $set: {
                        'ratings.value': (product.ratings.value + req.body.rating) / product.ratings.users.length
                    }
                });
            } else {
                product = await Product.findOne({_id: req.params.id});
                await Product.updateOne({_id: req.params.id}, {
                    $push: {
                        'ratings.users': req.decoded._id
                    },
                    $set: {
                        'ratings.value': (product.ratings.value + req.body.rating) / (product.ratings.users.length + 1)
                    }
                });
            }
            product = await Product.findOne({_id: req.params.id});
            return res.status(200).json({
                status: 'Successful',
                message: 'Rating successfully updated',
                data: product
            })
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    }
}