const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentaireSchema = new mongoose.Schema({
    userId: String,
    commentaire: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Commentaire',commentaireSchema);