const users = require('../App/Users/routes');
const agents = require('../App/Agents/routes');
const admins = require('../App/Admins/routes');
const categories = require('../App/Categories/routes');
const collections = require('../App/Collections/routes');
const products = require('../App/Products/routes');
const chats = require('../App/Chat/routes');
const messages = require('../App/Messages/routes');
const orders = require('../App/Orders/routes');


module.exports = {
    users,
    agents,
    admins,
    categories,
    products,
    chats,
    messages,
    orders,
    collections
}