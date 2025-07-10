const model = require('../models/item');
const Offer = require('../models/offer');
//GET /items: send all items to the user 
exports.index = (req, res, next) => {
    let query = req.query.search;
    if (query != undefined)
    {
        let queryFilter = 
        {
            $and: [
                {active: true},
                {
                    $or: [
                        {title: {$regex: query, $options: "i"}},
                        {details: {$regex: query, $options: "i"}}
                    ]
                }
            ]
        }
        model.find(queryFilter).sort({price:'asc'})
        .then(items => res.render('./item/index', {items}))
        .catch(err => next(err));
    }
    else {
        model.find({active: true}).sort({price: 'asc'})
        .then(items => res.render('./item/index', {items}))
        .catch(err => next(err));
    }
};

//GET /items/new: send html form for creating a new item

exports.new = (req, res) =>{
    res.render('./item/new');
};

//POST /items: create a new item

exports.create = (req, res, next) => {
    let item = new model(req.body);
    if (req.file != undefined)
    {
        item.image = '/images/' + req.file.filename;
    }
    item.seller = req.session.user; 
    item.save()
    .then(item => {
        if (item) {
            req.flash('success', 'Your item was created successfully!');
            return res.redirect('/items')
        }
    })
    .catch(err => {
        if (err.name === 'ValidationError')
        {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        next(err);
    });
};

//GET /items/?search 


//GET /items/:id: send details of item identified by id
exports.show = (req,res, next)=>
{
    let id = req.params.id; 
    model.findById(id).populate('seller', 'firstName lastName')
    .then(item => {
        if (item)
        {
            return res.render('./item/show', {item});
        }
        else {
            let err = new Error('Cannot find a item with id ' + id);
            err.status = 404; 
            next(err);
        }
    })
    .catch(err => next(err));
};

//GET /items/:id/edit: send html form for editing an existing item 
exports.edit = (req, res, next) =>
{
    let id = req.params.id; 
    model.findById(id)
    .then(item => {
        if (item) {
            return res.render('./item/edit', {item});
        }
    })  
    .catch(err => next(err));
};

//PUT /items/:id: update the item identified by id 
exports.update = (req, res, next) =>
{
    let story = req.body; 
    let id = req.params.id; 

    model.findByIdAndUpdate(id, story, {useFindAndModify: false, runValidators: true})
    .then(item => {
        if (item) {
            req.flash('success', 'Item has been updated!');
            return res.redirect('/items/' + id);
        }
    })
    .catch(err => {
        if (err.name === 'ValidationError')
            err.status = 400; 
        next(err); 
    });
};

//DELETE /items/:id, delete the item identified by id 
exports.delete = (req, res, next) =>
{
    let id = req.params.id; 
    Offer.deleteMany({item:id})
    .then(offer => {
        if (offer) {
            console.log('Offers have been successfully removed');
        }
    })
    .catch(err => next(err));

    model.findByIdAndDelete(id, {useFindandModify: false})
    .then(item => {
        if (item) {
            req.flash('success', 'Your item was deleted successfully!');
            res.redirect('/items');
        }
    })
    .catch (err => next(err));
};

