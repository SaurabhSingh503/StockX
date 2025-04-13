const mongoose = require('mongoose');
const { hash, compare } = require('bcrypt');
const bcrypt = require('bcrypt');

// Schema definition
const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Store Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    contactNumber: {
        type: String,
        required: [true, 'Contact Number is required'],
        unique: true,
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
    },
    uniqueCode: {
        type: String,
        required: true,
        unique: true,
    },
    qrCode: {
        type: String,
        required: false,
        unique: true,
    },
});

// Hash password before saving
storeSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await hash(this.password, 10);
    next();
});

// Password comparison method
storeSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

const Store = mongoose.model('Store', storeSchema);
module.exports = Store;