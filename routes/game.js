const express = require('express');
const router = express.Router();

const gameCtrl = require('../controllers/game');

router.get('/getGames', gameCtrl.getGames);
router.post('/addGame', gameCtrl.addGame);