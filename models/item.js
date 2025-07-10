const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    title: {type: String, required: [true, 'title is required']},
    seller: {type: Schema.Types.ObjectId, ref: 'User'},
    condition: {type: String, required: [true, 'condition is required'], enum: ['New', 'Like New', 'Used/Pre-owned', 'Refurbished', 'Damaged']},
    price: {type: Number, min: 0.01,  required: [true, 'price is required']},
    details: {type: String, required: [true, 'description is required'], minLength: [10, 'the description should have at least 10 characters']},
    image: {type: String, required: [true, 'image is required']},
    totalOffers: {type: Number, default: 0, required:[true, 'totalOffers is required']},
    active: {type: Boolean, default: true, required: [true, 'status of the item is required']},
    highestOffer: {type: Number, default: 0}
}   
);

//collection name is items in the database 
module.exports = mongoose.model('Item', itemSchema);

    