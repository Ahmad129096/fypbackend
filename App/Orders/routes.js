const express = require('express');
const Controller = require('./controller');

const middleware = require('../../Functions/middlewares');

const router = express.Router();

router.post('/', middleware.authentication, Controller.Create);
router.get('/', middleware.authentication, Controller.List);
router.patch('/proceed/:id', middleware.authentication, Controller.ProceedOrder);
router.get('/:id', middleware.authentication, Controller.Read);
router.patch('/:id', middleware.authentication, Controller.Update);
router.delete('/:id', middleware.adminAuthentication, Controller.Delete);


module.exports = router;