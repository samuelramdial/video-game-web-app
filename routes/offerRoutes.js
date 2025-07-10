const express = require('express');
const controller = require('../controllers/offersController');
const {isLoggedIn, isAuthor, offerSeller} = require('../middleware/auth');
const router = express.Router({mergeParams: true});

//POST /offers: make an offer 
router.post('/', isLoggedIn, offerSeller, controller.makeOffer);

//GET /offers: get all offers for an item 
router.get('/', isLoggedIn, isAuthor, controller.viewOffers);

//POST /offers/:id  -> accept an offer 
router.post('/:offerId', isLoggedIn, isAuthor, controller.acceptOffer);
module.exports = router; 