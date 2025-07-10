const express = require('express');
const controller = require('../controllers/itemsController');
const { upload } = require('../middleware/fileUpload');
const {isLoggedIn, isAuthor} = require('../middleware/auth');
const {validateId} = require('../middleware/validator');
const offerRoutes = require('./offerRoutes');
const router = express.Router(); 

//GET /items: send all items to the user 

router.get('/', controller.index);

//GET /items/new: send html form for creating a new item

router.get('/new', isLoggedIn, controller.new);

//POST /items: create a new item

router.post('/', isLoggedIn,  upload, controller.create);

//GET /items/:id: send details of item identified by id

router.get('/:id', validateId, controller.show);

//GET /items/:id/edit: send html form for editing an existing item 

router.get('/:id/edit', validateId, isLoggedIn, isAuthor, controller.edit);

//PUT /items/:id: update the item identified by id 

router.put('/:id', validateId, isLoggedIn, isAuthor, upload, controller.update);

//DELETE /items/:id, delete the item identified by id 

router.delete('/:id', validateId, isLoggedIn, isAuthor, controller.delete);

//GET /items?:search: send items matching the search query 

router.use('/:id/offers', offerRoutes);
module.exports =  router;