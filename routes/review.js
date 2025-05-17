const express = require('express');
const router = express.Router();

const reviewCrtl = require('../controllers/review');

router.get('/getReviews/:game_id', reviewCrtl.getReviews);
router.post('/addReview', reviewCrtl.addReview);
router.put('/updateReview/:review_id', reviewCrtl.updateReview);
router.delete('/deleteReview/:review_id', reviewCrtl.deleteReview);

module.exports = router;