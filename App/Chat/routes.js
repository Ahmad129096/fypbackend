const express = require('express');
const Controller = require('./controller');
const middleware = require('../../Functions/middlewares');

const router = express.Router();

router.post('/', Controller.Create);
router.get('/', Controller.List);
router.get('/users', middleware.authentication, Controller.ListByUser);
router.get('/:id', Controller.Read);
router.patch('/:id', Controller.Update);
router.delete('/:id', Controller.Delete);

module.exports = router;