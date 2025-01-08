const mongoose = require('mongoose');

// AuctionItems Schema
const AuctionItemSchema = new mongoose.Schema({
    title: { type: String },
    description: { type: String },
    start_price: { type: Number },
    reserve_price: { type: Number }
});

module.exports = mongoose.model('AuctionItems', AuctionItemSchema);

