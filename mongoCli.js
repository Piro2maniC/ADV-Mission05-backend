const mongoose = require('mongoose');
const { Command } = require('commander');
const AuctionItems = require('./models/auctionItems');

const program = new Command();
const mongoURI = 'mongodb://localhost:27017/MISSION05';

async function connect() {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }
}

program
    .command('insert <title> <description> <start_price> <reserve_price>')
    .description('Insert an Auction Item into the database')
    .action(async (title, description, start_price, reserve_price) => {
        try {
            await connect();
            
            const auctionItem = new AuctionItems({
                title,
                description,
                start_price: parseFloat(start_price),
                reserve_price: parseFloat(reserve_price)
            });

            const result = await auctionItem.save();
            console.log('Inserted document:', result);
        } catch (err) {
            console.error('Error inserting document:', err.message);
        } finally {
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
            console.log('Found items:', items);
        } catch (err) {
            console.error('Error finding documents:', err.message);
        } finally {
            await mongoose.connection.close();
        }
    });

program.parse(process.argv);