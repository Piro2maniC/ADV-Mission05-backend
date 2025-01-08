// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const AuctionItems = require('./models/auctionItems');

const app = express();
const port = 4000;
const mongoURI = 'mongodb://localhost:27017/MISSION05';

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// Insert Route
app.post('/insert', async (req, res) => {
    try {
        const auctionItem = new AuctionItems(req.body);
        const result = await auctionItem.save();
        res.status(201).json(result);
    } catch (error) {
        console.error('Error inserting document:', error);
        res.status(500).json({ error: error.message });
    }
});

// Find Route
app.get('/find', async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        
        if (search) {
            query = {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            };
        }
        
        const documents = await AuctionItems.find(query);
        res.json(documents);
    } catch (error) {
        console.error('Error finding documents:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get single auction item by ID
app.get('/api/auction-items/:id', async (req, res) => {
    try {
        const item = await AuctionItems.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        console.error('Error finding item:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update Route
app.put('/update/:id', async (req, res) => {
    try {
        const result = await AuctionItems.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!result) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.json(result);
    } catch (error) {
        console.error('Error updating document:', error);
        res.status(500).json({ error: error.message });
    }
});

// Place bid on an item
app.post('/api/auction-items/:id/bid', async (req, res) => {
    try {
        const { bid_amount } = req.body;
        const item = await AuctionItems.findById(req.params.id);
        
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        
        if (bid_amount <= item.current_bid) {
            return res.status(400).json({ message: 'Bid must be higher than current bid' });
        }
        
        item.current_bid = bid_amount;
        item.bids += 1;
        await item.save();
        
        res.json(item);
    } catch (error) {
        console.error('Error placing bid:', error);
        res.status(500).json({ error: error.message });
    }
});

// Buy now
app.post('/api/auction-items/:id/buy-now', async (req, res) => {
    try {
        const item = await AuctionItems.findById(req.params.id);
        
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        
        if (!item.buy_now_price) {
            return res.status(400).json({ message: 'Buy now not available for this item' });
        }
        
        item.current_bid = item.buy_now_price;
        item.is_sold = true;
        await item.save();
        
        res.json(item);
    } catch (error) {
        console.error('Error processing buy now:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete Route
app.delete('/delete/:id', async (req, res) => {
    try {
        const result = await AuctionItems.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
