const mongoose = require('mongoose');
const { Command } = require('commander');
const AuctionItems = require('./models/auctionItems');
const fs = require('fs'); // Add this line to import the fs module

const program = new Command();
const mongoURI = 'mongodb://localhost:27017/auctions_db';

/**
 * Connect to the MongoDB database. If the connection fails, exit the program.
 * @returns {Promise<void>}
 */
async function connect() {
    try {
        // Try to connect to the MongoDB database
        await mongoose.connect(mongoURI);

        // If the connection is successful, print a success message
        console.log('Connected to MongoDB');
    } catch (err) {
        // If the connection fails, print an error message and exit the program
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }
}

// Need to add a seed from file comand

program
    .command('insert <title> <description> <start_price> <reserve_price>')
    .description('Insert an Auction Item into the database')
    .action(async (title, description, start_price, reserve_price) => {
        try {
            // Attempt to connect to the MongoDB database. If the connection fails,
            // print an error message and exit the program.
            await connect();

            // Create a new AuctionItems document with the given title, description,
            // start price, and reserve price.
            const auctionItem = new AuctionItems({
                title, // The title of the auction item
                description, // The description of the auction item
                start_price: parseFloat(start_price), // The starting price of the auction
                reserve_price: parseFloat(reserve_price) // The reserve price of the auction
            });

            // Save the document to the database. If the save fails, print an error
            // message. If it succeeds, print a success message with the saved document.
            const result = await auctionItem.save();
            console.log('Inserted document:', result);
        } catch (err) {
            // If an error occurs while inserting the document, print an error message
            // with the error message.
            console.error('Error inserting document:', err.message);
        } finally {
            // Close the MongoDB connection, whether or not an error occurred.
            await mongoose.connection.close();
        }
    });

program
    .command('find <title>')
    .description('Find Auction Item by title')
    .action(async (title) => {
        try {
            await connect();
            const items = await AuctionItems.find({ title });
            if (items.length > 0) {
                console.log('Found items:');
                console.log(items);
            } else {
                console.log('No items found with title', title);
            }
        } catch (err) {
            console.error('Error finding documents:', err.message);
        } finally {
            await mongoose.connection.close();
        }
    });

program
    .command('update <id> <title> <description> <start_price> <reserve_price>')
    .description('Update an Auction Item in the database')
    .action(async (id, title, description, start_price, reserve_price) => {
        try {
            await connect();
            const filter = { _id: id };
            const update = {
                title,
                description,
                start_price: parseFloat(start_price),
                reserve_price: parseFloat(reserve_price)
            };
            const result = await AuctionItems.updateOne(filter, { $set: update });
            console.log('Updated document:', result);
        } catch (err) {
            console.error('Error updating document:', err.message);
        } finally {
            await mongoose.connection.close();
        }
    });

program
    .command('delete <id>')
    .description('Delete an Auction Item from the database')
    .action(async (id) => {
        try {
            await connect();
            const filter = { _id: id };
            const result = await AuctionItems.deleteOne(filter);
            console.log('Deleted document:', result);
        } catch (err) {
            console.error('Error deleting document:', err.message);
        } finally {
            await mongoose.connection.close();
        }
    });

    program
    .command('seed <filePath>')
    .description('Seed the database with auction items from a JSON file')
    .action(async (filePath) => {
        try {
            await connect();
            const data = fs.readFileSync(filePath);
            const auctionItems = JSON.parse(data);
            console.log('Data to be seeded:', auctionItems); // Add this line
            const result = await AuctionItems.insertMany(auctionItems);
            console.log('Seeded documents:', result);
        } catch (err) {
            console.error('Error seeding documents:', err.message);
        } finally {
            await mongoose.connection.close();
        }
    });

// run this to seed the json file
// node mongoCli.js seed c:/Users/GGPC/Desktop/ADV_DEV_MISSIONS/MISSION05/ADV-Mission05-backend/auctionData.json

program.parse(process.argv);