const mongoose = require('mongoose');

// AuctionItems Schema
const AuctionItemSchema = new mongoose.Schema({
    title: { type: String },
    description: { type: String },
    start_price: { type: Number },
    reserve_price: { type: Number },
    location: { type: String },
    closing_time: { type: String },
    image_url: { type: String }
});

module.exports = mongoose.model('AuctionItems', AuctionItemSchema);