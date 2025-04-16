# StockX by Saurabh Singh


## 🚀 About my Project

**StockX** is a full-stack application designed to help store owners efficiently manage their inventory, track purchases, and analyze stock levels. The system integrates **MongoDB, Express, React, and Flask (Python)** to provide a seamless experience.

## 🏗️ Features

### ✅ **Inventory Management**
- Add, update, and remove inventory items
- Generate **unique 11-digit item codes** with **QR codes** for easy identification
- Track real-time stock levels per item
- **Low stock & excess stock alerts** via email notifications

### 🛒 **Purchase Recording System**
- Record purchases dynamically with buyer details
- Fetch **item names from the resources database** using item codes
- Automatically deduct **purchased quantities from inventory**
- Generate unique **Purchase IDs** and **QR codes** for each transaction
- Filter purchases by `storeEmail`

### 📊 **Analytics & Dashboard**
- Visual representation of stock trends & stock analysis
- Display purchase history filtered by `storeEmail`
- View **low stock warnings** and **excess stock alerts**

### 🔑 **Authentication & Security**
- Unique **store authentication system** with **QR code signup**
- Secure login & access control using store-based filtering

## 🏗️ Tech Stack

### **Frontend:**
- **Vite.js** (Dynamic UI)
- **Tailwind CSS** (UI styling)
- **Axios** (API calls)

### **Backend:**
- **Flask** (Python-based backend for processing)
- **MongoDB Atlas** (Cloud database for inventory & purchases)
- **Express.js** (Handling API routes efficiently)

### **Libraries & Dependencies:**
- `mongoose` (MongoDB ODM for schema modeling)
- `pandas` (Data processing for analytics)
- `qrcode` (QR Code generation)
- `nodemailer` (Email alerts for inventory)

## 📜 Installation & Setup

### *
```

### **2️⃣ Install Backend and ML Dependencies**
```sh
 cd server
 npm install
 cd ml-models
 pip install -r requirements.txt
```

### **3️⃣ Install Frontend and Root Dependencies**
```sh
 cd client
 npm install
 cd ../
 npm install
```

### **4️⃣ Set Up Environment Variables**
Create a `.env` file in both backend and frontend directories:

#### **Server (.env)**
```
MONGODB_URI = 
PORT = 
JWT_SECRET = 
CLIENT_URL = 
EMAIL_USER = 
EMAIL_PASS = 
CLOUDINARY_API_SECRET =  
CLOUDINARY_API_KEY = 
CLOUDINARY_CLOUD_PRESET = 
CLOUDINARY_CLOUD_NAME = 
```

#### **Client (.env)**
```
VITE_PUBLIC_BACKEND_URL = 
VITE_CLOUDINARY_API = 
VITE_CLOUDINARY_API_SECRET =  
VITE_CLOUDINARY_API_KEY = 
```

#### **ML-models (.env)**
```
MONGODB_URI = 
DB_NAME = 
COLLECTION_NAME = 
GROQ_API_KEY = 
EMAIL_USER = 
EMAIL_PASS = 
```

### **5️⃣ Run the Project**
#### Start ML Model
```sh
cd ml-models
python server.py
```
#### Start Complete Project (At root)
```sh
npm run start
```

## 📌 API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/resources/all` | `GET` | Fetch inventory for a specific storeEmail |
| `/api/resources/add` | `POST` | Add a new inventory item |
| `/api/purchase/add` | `POST` | Record a new purchase |
| `/api/purchase/all` | `GET` | Fetch all purchases (filtered by storeEmail) |






