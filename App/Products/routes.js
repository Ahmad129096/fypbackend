const express = require('express');
const Controller = require('./controller');

const router = express.Router();

router.post('/', Controller.Create);
router.get('/', Controller.List);
router.get('/home', Controller.ProductForHome);
router.get('/category', Controller.ProductsByCategory);
router.get('/:id', Controller.Read);
router.patch('/:id', Controller.Update);
router.delete('/:id', Controller.Delete);


module.exports = router;