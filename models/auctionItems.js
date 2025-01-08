const mongoose = require('mongoose');

// AuctionItems Schema
const AuctionItemSchema = new mongoose.Schema({
    title: { type: String },
    description: { type: String },
    start_price: { type: Number },
    reserve_price: { type: Number },
    buy_now_price: { type: Number },
    current_bid: { type: Number },
    image_url: { type: String },
    location: { type: String },
    closing_date: { type: Date },
    category: { type: String },
    closing_time: { type: String },
    views: { type: Number, default: 0 },
    bids: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    watchlist: { type: Array, default: [] },
    is_deleted: { type: Boolean, default: false },
    is_sold: { type: Boolean, default: false },
});
 

module.exports = mongoose.model('AuctionItems', AuctionItemSchema);

