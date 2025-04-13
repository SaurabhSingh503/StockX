const express = require('express'); // Importing express
const bodyParser = require('body-parser'); // Importing body-parser
const mongoose = require('mongoose'); // Importing mongoose
const cors = require('cors'); // Importing cors
const { createServer } = require('http'); // Importing http
const cloudinary = require('cloudinary').v2; // Importing cloudinary
const authRoutes = require('./routes/auth'); // Import the auth route
const resourceRoutes = require('./routes/resource'); // Import the resource route
const purchaseRoutes = require('./routes/purchases'); // Import the purchase route


// Configurations
require('dotenv').config();
const app = express();
const httpServer = createServer(app);


// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(bodyParser.json());
app.use(express.json());


// Routes
app.use('/api/auth', authRoutes); // Use the auth route
app.use('/api/resource', resourceRoutes); // Use the resource route
app.use('/api/purchase', purchaseRoutes); // Use the purchase route


// Cloudinary configuration
cloudinary.config({
    cloud_name: 'sambit-mondal', // Cloud name
    api_key: process.env.CLOUDINARY_API_KEY, // API key
    api_secret: process.env.CLOUDINARY_API_SECRET, // API secret
});

app.post('/api/cloudinary-signature', (req, res) => {
    const timestamp = Math.round(new Date().getTime() / 1000); // Current timestamp
    const signature = cloudinary.utils.api_sign_request(
        { timestamp, upload_preset: 'cn-hackathon' },
        process.env.CLOUDINARY_API_SECRET
    );

    res.json({ timestamp, signature });
});


// DB Connection
const MongoDB_URI = process.env.MONGODB_URI;
mongoose.connect(MongoDB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


// Server
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});