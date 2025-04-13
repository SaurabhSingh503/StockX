from dotenv import load_dotenv
import os
load_dotenv()

from pymongo import MongoClient
import pandas as pd

# Load MongoDB connection settings from .env file
MONGODB_ATLAS_URI = os.getenv("MONGODB_ATLAS_URI")
DB_NAME = os.getenv("MONGO_DB_NAME", "CN-Hackathon")
COLLECTION_NAME = os.getenv("MONGO_COLLECTION", "resources")

client = MongoClient(MONGODB_ATLAS_URI)
db = client[DB_NAME]  # Use your database name from .env
collection = db[COLLECTION_NAME]  # Use your collection name from .env

def load_inventory_data():
    """Load inventory data from MongoDB Atlas and return a DataFrame."""
    data = list(collection.find())
    if data:
        df = pd.DataFrame(data)
        if '_id' in df.columns:
            df.drop(columns=['_id'], inplace=True)
        return df
    return pd.DataFrame()

def simulate_stock_arrival():
    """Simulate arrival of new stock by increasing quantity of one item."""
    item = collection.find_one()  # For demo purposes, update the first item
    if item:
        new_quantity = item.get('quantity', 0) + 20  # Increase quantity by 20
        collection.update_one({'_id': item['_id']}, {'$set': {'quantity': new_quantity}})
        return {"success": True, "item": item.get('title', 'Unknown'), "new_quantity": new_quantity}
    return {"success": False, "error": "No items found in inventory."}

def simulate_stock_dispatch():
    """Simulate dispatch of stock by decreasing quantity of one item."""
    item = collection.find_one()
    if item:
        current_qty = item.get('quantity', 0)
        if current_qty >= 5:
            new_quantity = current_qty - 5  # Dispatch 5 units
            collection.update_one({'_id': item['_id']}, {'$set': {'quantity': new_quantity}})
            return {"success": True, "item": item.get('title', 'Unknown'), "new_quantity": new_quantity}
        return {"success": False, "error": "Not enough stock to dispatch."}
    return {"success": False, "error": "No items found in inventory."}
