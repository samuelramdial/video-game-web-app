const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const offerSchema = new Schema({
    //reference the user id and item id
    buyer: {type: Schema.Types.ObjectId, ref: 'User'},
    item: {type: Schema.Types.ObjectId, ref: 'Item'},
    amount: {type: Number, min: 0.01, required: [true, 'amount is required']},
    status: {type: String, default:'pending', required: [true, 'status is required'], enum: ['pending', 'rejected', 'accepted']}
});

module.exports = mongoose.model('Offer', offerSchema);