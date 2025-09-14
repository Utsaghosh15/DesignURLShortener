const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/database');


// Imporrt Routes
const createURLRoute = require('./routes/createURLRoute/createURLRoute.route');
// const getURLRoute = require('../routes/getURLRoute/getURLRoute.route');


const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/api/createURL', createURLRoute);
// app.use('/api/getURL', getURLRoute);


connectDB();


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});