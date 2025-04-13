const express = require('express');
const { signup, login } = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middlewares/validateInput');
const Store = require('../models/store');
const Product = require('../models/resource');

const router = express.Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);

// Fetch store details by email
router.get('/store/:email', async (req, res) => {
    try {
        const store = await Store.findOne({ email: req.params.email });
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }
        res.json({ name: store.name });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/store/qrcode/:email', async (req, res) => {
    try {
        const store = await Store.findOne({ email: req.params.email });
        if (!store || !store.qrCode) {
            return res.status(404).json({ message: 'QR Code not found' });
        }
        res.json({ qrCode: store.qrCode }); // Returns base64 QR Code
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;