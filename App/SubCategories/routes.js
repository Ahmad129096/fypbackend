const express = require('express');
const Controller = require('./controller');

const middleware = require('../../Functions/middlewares');

const router = express.Router();

router.post('/', middleware.adminAuthentication, Controller.Create);
router.get('/', middleware.authentication, Controller.List);
router.get('/:id', middleware.authentication, Controller.Read);
router.patch('/:id', middleware.adminAuthentication, Controller.Update);
router.delete('/:id', middleware.adminAuthentication, Controller.Delete);

module.exports = router;