const { MongoClient } = require('mongodb');
const { Command } = require('commander');

// node mongo_cli.js <command>
// Replace <command> with insert, find, update, delete, or time as needed. 

const program = new Command();
const url = 'mongodb://localhost:27017'; // Change if necessary
const dbName = 'MISSION05'; // Change to your database name

const client = new MongoClient(url);

async function connect() {
    await client.connect();
    console.log('Connected to MongoDB');
}

program
    .command('insert <data>')
    .description('Insert a document into the database')
    .action(async (data) => {
        await connect();
        const db = client.db(dbName);
        const collection = db.collection('MISSION05'); // Change to your collection name
        const result = await collection.insertOne(JSON.parse(data));
        console.log(`Inserted document: ${result.insertedId}`);
        client.close();
    });

program
    .command('find')
    .description('Find all documents in the database')
    .action(async () => {
        await connect();
        const db = client.db(dbName);
        const collection = db.collection('MISSION05'); // Change to your collection name
        const documents = await collection.find({}).toArray();
        console.log(documents);
        client.close();
    });

program
    .command('update <id> <data>')
    .description('Update a document in the database')
    .action(async (id, data) => {
        await connect();
        const db = client.db(dbName);
        const collection = db.collection('MISSION05'); // Change to your collection name
        const result = await collection.updateOne({ _id: id }, { $set: JSON.parse(data) });
        console.log(`Updated document: ${result.modifiedCount}`);
        client.close();
    });

program
    .command('delete <id>')
    .description('Delete a document from the database')
    .action(async (id) => {
        await connect();
        const db = client.db(dbName);
        const collection = db.collection('MISSION05'); // Change to your collection name
        const result = await collection.deleteOne({ _id: id });
        console.log(`Deleted document: ${result.deletedCount}`);
        client.close();
    });

program
    .command('time')
    .description('Display the current local time')
    .action(() => {
        console.log(`Current local time: ${new Date('2024-12-17T09:54:59+13:00').toString()}`);
    });

program.parse(process.argv);