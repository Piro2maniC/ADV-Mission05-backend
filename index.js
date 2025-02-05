// index.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const AuctionItems = require("./models/auctionItems");

const app = express();
const port = 5001; // Changed from 5000 to 5001
const mongoURI = "mongodb://localhost:27017/MISSION05";

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002']


app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
}));

app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

// Insert Route
app.post("/insert", async (req, res) => {
  try {
    const auctionItem = new AuctionItems(req.body);
    const result = await auctionItem.save();
    res.status(201).json(result);
  } catch (error) {
    console.error("Error inserting document:", error);
    res.status(500).json({ error: error.message });
  }
});

// Find Route
app.get("/find", async (req, res) => {
  try {
    const { search, id } = req.query;
    let query = {};

    if (id) {
      query = { _id: id };
    } else if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };
    }

    const documents = await AuctionItems.find(query);
    res.json(documents);
  } catch (error) {
    console.error("Error finding documents:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/auctions", async (req, res) => {
  try {
    const items = await AuctionItems.find().limit(10);
    console.log("Fetched items:", items); // Log fetched items
    res.json(items);
  } catch (err) {
    console.error("Error fetching auction items:", err);
    res.status(500).json({ error: "Failed to fetch auction items" });
  }
});

// Endpoint to compare multiple items
app.get("/api/auction-items/compare", async (req, res) => {
  try {
    const ids = req.query.ids?.split(","); // Expects ids as comma-separated string

    if (!ids || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided" });
    }

    const items = await AuctionItems.find({ _id: { $in: ids } });

    if (items.length === 0) {
      return res.status(404).json({ message: "No items found" });
    }

    res.json(items);
  } catch (error) {
    console.error("Error finding items:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get single auction item by ID
app.get("/api/auction-items/:id", async (req, res) => {
  try {
    const item = await AuctionItems.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    console.error("Error finding item:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/auctions", async (req, res) => {
  try {
    const items = await AuctionItems.find().limit(10);
    console.log("Fetched items:", items); // Log fetched items
    res.json(items);
  } catch (err) {
    console.error("Error fetching auction items:", err);
    res.status(500).json({ error: "Failed to fetch auction items" });
  }
});

// Get single auction item by ID
app.get("/api/auction-items/:id", async (req, res) => {
  try {
    const item = await AuctionItems.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    console.error("Error finding item:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update Route
app.put("/update/:id", async (req, res) => {
  try {
    const result = await AuctionItems.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!result) {
      return res.status(404).json({ error: "Document not found" });
    }
    res.json(result);
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: error.message });
  }
});

// Place bid on an item
app.post("/api/auction-items/:id/bid", async (req, res) => {
  try {
    const { bid_amount } = req.body;
    const item = await AuctionItems.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (bid_amount <= item.current_bid) {
      return res
        .status(400)
        .json({ message: "Bid must be higher than current bid" });
    }

    item.current_bid = bid_amount;
    item.bids += 1;
    await item.save();

    res.json(item);
  } catch (error) {
    console.error("Error placing bid:", error);
    res.status(500).json({ error: error.message });
  }
});

// Buy now
app.post("/api/auction-items/:id/buy-now", async (req, res) => {
  try {
    const item = await AuctionItems.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (!item.buy_now_price) {
      return res
        .status(400)
        .json({ message: "Buy now not available for this item" });
    }

    item.current_bid = item.buy_now_price;
    item.is_sold = true;
    await item.save();

    res.json(item);
  } catch (error) {
    console.error("Error processing buy now:", error);
    res.status(500).json({ error: error.message });
  }
});

// Place bid on an item
app.post("/api/auction-items/:id/bid", async (req, res) => {
  try {
    const { bid_amount } = req.body;
    const item = await AuctionItems.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (bid_amount <= item.current_bid) {
      return res
        .status(400)
        .json({ message: "Bid must be higher than current bid" });
    }

    item.current_bid = bid_amount;
    item.bids += 1;
    await item.save();

    res.json(item);
  } catch (error) {
    console.error("Error placing bid:", error);
    res.status(500).json({ error: error.message });
  }
});

// Buy now
app.post("/api/auction-items/:id/buy-now", async (req, res) => {
  try {
    const item = await AuctionItems.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (!item.buy_now_price) {
      return res
        .status(400)
        .json({ message: "Buy now not available for this item" });
    }

    item.current_bid = item.buy_now_price;
    item.is_sold = true;
    await item.save();

    res.json(item);
  } catch (error) {
    console.error("Error processing buy now:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete Route
app.delete("/delete/:id", async (req, res) => {
  try {
    const result = await AuctionItems.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Document not found" });
    }
    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Server is running on port ${port}`);
});
