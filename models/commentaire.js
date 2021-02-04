const mongoose = require('mongoose');

const commentaireSchema = new mongoose.Schema({
    userId: String,
    commentaire: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Commentaire',commentaireSchema);