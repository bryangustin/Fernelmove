const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
    userId: String,
    suggestion: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('suggestion',suggestionSchema);