const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required.'],
        minlength: [5, 'Username must be at least 5 characters long.'],
        maxlength: [20, 'Username cannot be more than 20 characters long.'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        match: [/.+\@.+\..+/, 'Please fill a valid email address.'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minlength: [8, 'Password must be at least 8 characters long.']
    },
    role: { 
        type: String, 
        required: false, 
        enum: ['superAdmin', 'schoolAdmin', 'regularUser'], 
        default: 'regularUser' 
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);