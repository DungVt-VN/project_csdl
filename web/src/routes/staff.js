const express = require('express');
const router = express.Router();

const staffController = require('../app/controllers/StaffController');

//newsController.index
router.get('/', staffController.staff);
router.post('/', staffController.poststaff);



module.exports = router;
