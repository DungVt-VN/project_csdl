const express = require('express');
const router = express.Router();

const pass_wrongController = require('../app/controllers/Pass_wrongController');

//newsController.index
router.get('/', pass_wrongController.wrong);

module.exports = router;
