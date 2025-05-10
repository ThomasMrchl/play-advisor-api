const express = require('express');
const router = express.Router();

const reviewCrtl = require('../controllers/review');

router.get('/getReviews', reviewCrtl.getReviews);
router.post('/addReview', reviewCrtl.addReview);