const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
    age: { type: Number, required: false }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);