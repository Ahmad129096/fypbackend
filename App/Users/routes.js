const express = require('express');
const Controller = require('./controller');


const router = express.Router();

router.post('/', Controller.Create);
router.post('/login', Controller.Login);
router.get('/', Controller.List);
router.patch('/password/set/:id', Controller.SetPassword);
router.get('/:id',  Controller.Read);
router.patch('/:id', Controller.Update);
router.delete('/:id', Controller.Delete);


module.exports = router;