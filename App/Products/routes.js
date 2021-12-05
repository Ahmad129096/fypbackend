const express = require('express');
const Controller = require('./controller');

const middleware = require('../../Functions/middlewares');

const router = express.Router();

router.post('/', middleware.authentication ,Controller.Create);
router.get('/', middleware.authentication, Controller.List);
router.get('/search/advance', middleware.authentication, Controller.AdvanceSearch);
router.get('/home', middleware.authentication, Controller.ProductForHome);
router.get('/category', middleware.authentication, Controller.ProductsByCategory);
router.get('/subcategory', middleware.authentication, Controller.ProductsBySubCategory);
router.get('/vendor/:id', middleware.authentication, Controller.ProductsByVendor);
router.get('/:id', middleware.authentication, Controller.Read);
router.post('/ratings/:id', middleware.authentication, Controller.Ratings);
router.patch('/:id', middleware.authentication, Controller.Update);
router.delete('/:id', middleware.authentication, Controller.Delete);


module.exports = router;