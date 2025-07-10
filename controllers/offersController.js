const model = require('../models/offer');
const Item = require('../models/item');
const User = require('../models/user');


exports.makeOffer = (req, res, next) => {
    let itemId = req.params.id; 
    let offer = new model(req.body); 
    offer.buyer = req.session.user;
    offer.item = itemId;

    offer.save()
    .then(offer => {
        if (offer) {
            Item.findById(itemId)
            .then(item => {
            if (item) {
                if (item.highestOffer < req.body.amount)
                {
                    item.highestOffer = req.body.amount; 
                }
                item.totalOffers += 1;
                item.save();
            }
        })
        .catch(err => next(err));
        req.flash('success', 'Your offer was made successfully');
        return res.redirect('/items/' + itemId);
        }
    })
    .catch(err => {
        if (err.name === 'ValidationError'){
            req.flash('error', 'Not a valid amount');
            return res.redirect('back');
        }
        next(err);
    });
};

exports.viewOffers = (req, res, next) => {
    let userId = req.session.user;
    let itemId = req.params.id;
    if (userId != null) {
        Promise.all([model.find({item:itemId}), Item.findById(itemId), User.find()])
        .then (results => {
            const [offers, item, users] = results; 
            res.render('./offer/offers', {offers, item, users})
        })
        .catch(err => next(err));
    }
    else {
        res.redirect('/users/login');
    }
};

exports.acceptOffer = (req, res, next) => {
    let itemId = req.params.id; 
    let offerId = req.params.offerId; 

    Item.findById(itemId)
    .then(item => {
        if (item)
        {
            item.active = false;
            item.save();
        }
    })
    .catch(err => next(err));

    model.findById(offerId)
    .then(offer => {
        if (offer) 
        {
            offer.status = 'accepted';
            offer.save();
        }
    })
    .catch(err => next(err));  

    model.updateMany({item:itemId, status: 'pending', _id: {$ne:offerId}}, {status: 'rejected'})
    .then(result => {
        if (result)
        {
            res.redirect(`/items/${itemId}/offers`);
        }
    })
    .catch(err => next(err));
};