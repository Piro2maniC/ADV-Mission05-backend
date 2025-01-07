// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const AuctionItems = require('./models/auctionItems');

const app = express();
const port = 5000;
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

// Fetch 5 auction items
app.get('/api/auctions', async (req, res) => {
    try {
        const items = await AuctionItems.find().limit(10);
        console.log('Fetched items:', items); // Log fetched items
        res.json(items);
    } catch (err) {
        console.error('Error fetching auction items:', err);
        res.status(500).json({ error: 'Failed to fetch auction items' });
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
    console.log(`Server is running on http://localhost:${port}`);
});
