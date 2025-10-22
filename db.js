const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.DB_NAME || 'myDatabase',
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;