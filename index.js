// index.js
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 5000; // You can change the port if needed
const url = 'mongodb://localhost:27017'; // MongoDB connection URL
const dbName = 'mydatabase'; // Change to your database name

app.use(bodyParser.json());

let db;

// Connect to MongoDB
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to MongoDB');
        db = client.db(dbName);
    })
    .catch(error => console.error(error));

// Insert Route
app.post('/insert', async (req, res) => {
    try {
        const result = await db.collection('mycollection').insertOne(req.body);
        res.status(201).send({ insertedId: result.insertedId });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Find Route
app.get('/find', async (req, res) => {
    try {
        const documents = await db.collection('mycollection').find({}).toArray();
        res.send(documents);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update Route
app.put('/update/:id', async (req, res) => {
    try {
        const result = await db.collection('mycollection').updateOne(
            { _id: new MongoClient.ObjectId(req.params.id) },
            { $set: req.body }
        );
        res.send({ modifiedCount: result.modifiedCount });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Delete Route
app.delete('/delete/:id', async (req, res) => {
    try {
        const result = await db.collection('mycollection').deleteOne({ _id: new MongoClient.ObjectId(req.params.id) });
        res.send({ deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Time Route
app.get('/time', (req, res) => {
    res.send({ currentTime: new Date('2024-12-17T11:09:04+13:00').toString() });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});