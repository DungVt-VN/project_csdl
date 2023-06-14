const express = require('express');
const router = express.Router();


const adminController = require('../app/controllers/AdminController');

//newsController.index
router.get('/', adminController.admin);
router.post('/insert_tb', adminController.posttb);
router.post('/insert_nv', adminController.postnv);
router.post('/delete_nv', adminController.deletenv);
router.post('/delete_tb', adminController.deletetb);

module.exports = router;
