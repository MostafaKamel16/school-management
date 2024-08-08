const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }],
}, { timestamps: true });

module.exports = mongoose.model('School', schoolSchema);