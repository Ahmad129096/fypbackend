const express = require('express');
const Controller = require('./controller');

const router = express.Router();

router.post('/', Controller.Create);
router.get('/', Controller.List);
router.patch('/proceed/:id', Controller.ProceedOrder);
router.get('/:id', Controller.Read);
router.patch('/:id', Controller.Update);
router.delete('/:id', Controller.Delete);


module.exports = router;