const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    longURL: { 
        type: String, 
        required: true,
        index: true
    },
    shortCode: { 
        type: String, 
        required: true,
        unique: true,
        index: true 
    },
    expiryDate: { 
        type: Date, 
        required: true,
        index: true
    },
    clickCount: {
        type: Number,
        default: 0
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    createdAt: { 
        type: Date, 
        required: true 
    }
});

module.exports = mongoose.model('Url', urlSchema);