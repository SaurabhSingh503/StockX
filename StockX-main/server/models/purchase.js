const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const PurchaseSchema = new mongoose.Schema({
    purchaseID: { type: String, unique: true, default: () => uuidv4().slice(0, 11) },
    buyerName: { type: String, required: true },
    buyerMobile: { type: String, required: true },
    items: [
        {
            uniqueCode: { type: String, required: true },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    qrCode: { type: String },
    storageStoreEmail: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Purchase', PurchaseSchema);