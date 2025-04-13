const express = require('express');
const router = express.Router();
const Purchase = require('../models/purchase');
const Resource = require('../models/resource');
const QRCode = require('qrcode');

// Add a new purchase
router.post('/add', async (req, res) => {
    try {
        const { buyerName, buyerMobile, items, storageStoreEmail } = req.body;
        let totalAmount = 0;
        let formattedItems = [];

        for (let item of items) {
            const resource = await Resource.findOne({ uniqueCode: item.uniqueCode });
            if (!resource) return res.status(404).json({ message: `Item with code ${item.uniqueCode} not found` });

            let itemData = {
                uniqueCode: item.uniqueCode,
                name: resource.title,
                quantity: item.quantity,
                price: resource.price
            };

            totalAmount += item.quantity * resource.price;
            formattedItems.push(itemData);
        }

        const purchase = new Purchase({
            buyerName,
            buyerMobile,
            items: formattedItems,
            totalAmount,
            storageStoreEmail
        });

        // Generate QR Code
        const qrData = JSON.stringify({
            purchaseID: purchase.purchaseID,
            buyerName,
            buyerMobile,
            items: formattedItems,
            totalAmount,
            storageStoreEmail
        });

        purchase.qrCode = await QRCode.toDataURL(qrData);
        await purchase.save();

        // Reduce quantity in resources
        for (const item of items) {
            await Resource.updateOne(
                { uniqueCode: item.uniqueCode },
                { $inc: { quantity: -item.quantity } } // Reduce quantity
            );
        }

        res.status(201).json(purchase);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all purchases
router.get('/all', async (req, res) => {
    try {
        const purchases = await Purchase.find();
        res.json(purchases);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get purchase QR code
router.get('/qrcode/:purchaseID', async (req, res) => {
    try {
        const purchase = await Purchase.findOne({ purchaseID: req.params.purchaseID });
        if (!purchase) return res.status(404).json({ message: 'Purchase not found' });

        res.json({ qrCode: purchase.qrCode });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;