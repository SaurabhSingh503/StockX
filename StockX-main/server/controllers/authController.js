const Store = require('../models/store');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const QRCode = require('qrcode');
const nodemailer = require('nodemailer');

// Helper to generate unique code
const generateUniqueCode = (storeName) => {
    const namePart = storeName.replace(/\s+/g, '').substring(0, 3).toUpperCase();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `${namePart}-${randomDigits}`;
};

// Helper to send email
const sendEmail = async (email, uniqueCode) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Unique Login Code',
        text: `Your unique code for login is: ${uniqueCode}. \n Please keep it safe. \n This code will be required for login. \n Thank you.`,
    });
};

// Helper to generate JWT
const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Helper to validate password
const validatePassword = (password) => {
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
};

// Signup controller
exports.signup = async (req, res) => {
    const { name, email, contactNumber, address, password } = req.body;

    // Validate password
    if (!validatePassword(password)) {
        return res.status(400).json({
            message:
                'Password must be at least 6 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.',
        });
    }

    try {
        // console.log("Received signup request:", req.body); // Log request data

        // Generate unique code
        const uniqueCode = generateUniqueCode(name);
        // console.log("Generated unique code:", uniqueCode); // Log unique code

        // Generate QR code
        const qrData = { name, email, contactNumber, address };
        const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));
        // console.log("Generated QR Code successfully"); // Log QR generation

        // Create store
        const store = await Store.create({ name, email, contactNumber, address, password, uniqueCode, qrCode });
        // console.log("Store created successfully:", store); // Log store creation

        // Send unique code via email
        await sendEmail(email, uniqueCode);
        // console.log("Email sent successfully"); // Log email sending

        const token = generateToken(store);
        res.status(201).json({ message: 'Store created successfully', token });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Email is already in use' });
        }
        console.error("Signup error:", err); // Full error message
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// Login controller
exports.login = async (req, res) => {
    const { email, password, uniqueCode } = req.body;

    try {
        // console.log("Login request received:", req.body);

        const store = await Store.findOne({ email });
        if (!store) {
            // console.log("Store not found for email:", email);
            return res.status(400).json({ message: 'Invalid email' });
        }

        // console.log("Store found:", store);

        // Check if comparePassword method exists
        if (!store.comparePassword) {
            // console.error("Error: comparePassword method is missing from store model.");
            return res.status(500).json({ message: 'Server error: comparePassword method missing' });
        }

        const isMatch = await store.comparePassword(password);
        if (!isMatch) {
            // console.log("Invalid password for store:", email);
            return res.status(400).json({ message: 'Invalid password' });
        }

        if (store.uniqueCode !== uniqueCode) {
            // console.log("Invalid unique code for store:", email);
            return res.status(400).json({ message: 'Invalid unique code' });
        }

        const token = generateToken(store);
        res.status(200).json({
            message: 'Login successful',
            token,
            store: { name: store.name, email: store.email },
        });
    } catch (err) {
        // console.error("Login error:", err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};