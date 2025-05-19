const express = require('express');
const router = express.Router();

const gameCtrl = require('../controllers/game');

router.get('/getGames', gameCtrl.getGames);
router.get('/getGame/:game_name', gameCtrl.getGame);
router.post('/addGame', gameCtrl.addGame);
router.get('/top-rated-games', gameCtrl.getTopRatedGames);

module.exports = router;