const express = require('express');
const Resource = require('../models/resource');
const QRCode = require('qrcode');

const router = express.Router();

// Function to generate a unique 11-digit code
const generateUniqueCode = async () => {
    let code;
    let exists;
    do {
        code = Math.floor(10000000000 + Math.random() * 90000000000).toString(); // 11-digit code
        exists = await Resource.findOne({ uniqueCode: code });
    } while (exists);
    return code;
};

// Add a resource
router.post('/add', async (req, res) => {
    try {
        const { title, description, img, price, quantity, storeEmail } = req.body;

        const uniqueCode = await generateUniqueCode();

        const productDetails = JSON.stringify({
            title,
            description,
            img,
            price,
            storeEmail,
            uniqueCode
        });

        // Generate QR code
        const qrCode = await QRCode.toDataURL(productDetails);

        const newResource = new Resource({
            title,
            description,
            img,
            price,
            quantity,
            storeEmail,
            uniqueCode,
            qrCode // Store QR code in the database
        });

        await newResource.save();
        res.status(201).json(newResource);
    } catch (err) {
        console.error('Failed to add resource:', err);
        res.status(500).json({ error: 'Failed to add resource' });
    }
});

// Get all resources
router.get('/all', async (req, res) => {
    try {
        const resources = await Resource.find();
        res.status(200).json(resources);
    } catch (err) {
        // console.error('Failed to fetch resources:', err);
        res.status(500).json({ error: 'Failed to fetch resources' });
    }
});

// Get resource details by unique code
router.get('/:uniqueCode', async (req, res) => {
    try {
        const { uniqueCode } = req.params;
        const resource = await Resource.findOne({ uniqueCode });

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        res.status(200).json(resource);
    } catch (error) {
        console.error("Error fetching resource:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Update a resource
router.put('/:id', async (req, res) => {
    try {
        const updatedResource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedResource);
    } catch (err) {
        console.error('Failed to update resource:', err);
        res.status(500).json({ error: 'Failed to update resource' });
    }
});

// Delete a resource by ID
router.delete('/:id', async (req, res) => {
    try {
        const resourceId = req.params.id;
        console.log('Deleting resource with ID:', resourceId);

        const deletedResource = await Resource.findByIdAndDelete(resourceId);

        if (!deletedResource) {
            return res.status(404).json({ error: 'Resource not found' });
        }

        res.status(200).json({ message: 'Resource deleted successfully', resource: deletedResource });
    } catch (err) {
        console.error('Failed to delete resource:', err);
        res.status(500).json({ error: 'Failed to delete resource' });
    }
});

module.exports = router;