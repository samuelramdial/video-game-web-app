const model = require('../models/user');
const Item = require('../models/item');
const Offer = require('../models/offer');

exports.new = (req, res) => {
    return res.render('./user/new');
};

exports.create = (req, res, next) =>{
    let user = new model(req.body); 
    user.save()
    .then(user => {
        if (user) {
            req.flash('success', 'Registration succeeded!');
            res.redirect('/users/login');
        }
    })
    .catch(err => {
        if (err.name === 'ValidationError') {
            req.flash('error', err.message);
            return res.redirect('back');
        }

        if (err.code === 11000) {
            req.flash('error', 'Email has been used');
            return res.redirect('/users/new');
        }
        next(err);
    });   
};

exports.getUserLogin = (req, res) => {
    return res.render('./user/login');
};

exports.login = (req, res, next) => {
    //authenticate user's login request 
    let email = req.body.email; 
    let password = req.body.password; 
    //get the user that matches the email 
    model.findOne({email: email})
    .then(user => {
        if (user) {
            //user found in the database
            user.comparePassword(password)
            .then(result => {
                if (result) {
                    req.session.user = user._id; //store user's id in the session
                    req.flash('success', 'Successfully logged in!'); 
                    res.redirect('/users/profile');
                } else {
                    //console.log('wrong password');
                    req.flash('error', 'Wrong password!');
                    res.redirect('/users/login');
                }
            })
        } else {
            //console.log('wrong email address');
            req.flash('error', 'Wrong email address!');
            res.redirect('/users/login');
        }
    })
    .catch(err => next(err));
};

exports.profile = (req, res, next) => {
    let id = req.session.user; 
    if (id != null) {
        Promise.all([model.findById(id), Item.find({seller:id}), Offer.find({buyer:id}), Item.find()])
        .then (results => {
            const [user, items, offers, allItems] = results; 
            res.render('./user/profile', {user, items, offers, allItems});
        })
        .catch(err => next(err));
    }
    else {
        res.redirect('/users/login');
    }
};

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err)
            return next(err);
        else
            res.redirect('/');
    });
};