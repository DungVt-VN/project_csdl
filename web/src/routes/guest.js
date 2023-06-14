const express = require('express');
const router = express.Router();

const guestController = require('../app/controllers/GuestController');

//newsController.index
router.get('/', guestController.guest);
router.post('/insert_tam', guestController.post_insert_tam);
router.post('/search', guestController.search);

module.exports = router;
