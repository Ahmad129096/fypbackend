const express = require('express');
const Controller = require('./controller');

const middleware = require('../../Functions/middlewares');

const router = express.Router();

router.post('/', Controller.Create);
router.post('/login', Controller.Login);
router.get('/', middleware.adminAuthentication, Controller.List);
router.patch('/password/set/:id', Controller.SetPassword);
router.get('/:id', middleware.authentication, Controller.Read);
router.patch('/:id', middleware.authentication, Controller.Update);
router.delete('/:id', middleware.authentication, Controller.Delete);


module.exports = router;