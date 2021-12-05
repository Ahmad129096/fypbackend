const users = require('../App/Users/routes');
const admins = require('../App/Admins/routes');
const categories = require('../App/Categories/routes');
const subCategories = require('../App/SubCategories/routes');
const collections = require('../App/Collections/routes');
const products = require('../App/Products/routes');
const chats = require('../App/Chat/routes');
const messages = require('../App/Messages/routes');
const orders = require('../App/Orders/routes');
const news = require('../App/News/routes');
const vendors = require('../App/Vendors/routes');


module.exports = {
    users,
    admins,
    categories,
    subCategories,
    products,
    chats,
    messages,
    orders,
    collections,
    news,
    vendors
}