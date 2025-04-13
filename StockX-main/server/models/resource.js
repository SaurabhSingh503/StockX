const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    img: { type: String, required: true },
    price: { type: Number },
    quantity: { type: Number, required: true },
    storeEmail: { type: String, required: true },
    uniqueCode: { type: String, unique: true, required: true },
    qrCode: { type: String, required: true }
});

module.exports = mongoose.model('Resource', ResourceSchema);