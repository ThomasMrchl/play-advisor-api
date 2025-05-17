const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.get('/getUsers', userCtrl.getUsers);
router.post('/addUser', userCtrl.addUser);

module.exports = router;

