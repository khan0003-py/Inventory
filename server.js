const express = require('express');
const connectDB = require('./db');
const Item = require('./models/items');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database
connectDB();

// Create (POST)
app.post('/items', async (req, res) => {
    try {
        const { name, description } = req.body;
        const item = new Item({ name, description });
        await item.save();
        res.status(201).json({ 
            message: 'Item created successfully', 
            item 
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: err.message });
    }
});

// Read (GET all)
app.get('/items', async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });
        res.json({ 
            count: items.length,
            items 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read (GET by ID)
app.get('/items/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ error: 'Invalid item ID' });
        }
        res.status(500).json({ error: err.message });
    }
});

// Update (PUT)
app.put('/items/:id', async (req, res) => {
    try {
        const { name, description } = req.body;
        const item = await Item.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { 
                new: true,  // Return updated document
                runValidators: true  // Run schema validation
            }
        );
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json({ 
            message: 'Item updated successfully', 
            item 
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ error: 'Invalid item ID' });
        }
        res.status(500).json({ error: err.message });
    }
});

// Delete (DELETE)
app.delete('/items/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json({ 
            message: 'Item deleted successfully',
            item 
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ error: 'Invalid item ID' });
        }
        res.status(500).json({ error: err.message });
    }
});

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);

});

