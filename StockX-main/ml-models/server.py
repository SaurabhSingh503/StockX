from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pymongo
from dotenv import load_dotenv
from chatbot import get_bot_response  # Import chatbot function
import mail_alerts  # Import the email alert functions
import inventory   # Import inventory functions
from threading import Thread
from apscheduler.schedulers.background import BackgroundScheduler

# Load environment variables
load_dotenv()
MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")

# Define stock thresholds (can also be set in .env)
LOW_STOCK_THRESHOLD = int(os.getenv("LOW_STOCK_THRESHOLD", 50))
EXCESS_STOCK_THRESHOLD = int(os.getenv("EXCESS_STOCK_THRESHOLD", 100))

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication
scheduler = BackgroundScheduler()
scheduler.start()
# Connect to MongoDB
mongo_client = pymongo.MongoClient(MONGODB_URI)
db = mongo_client[DB_NAME]
inventory_collection = db[COLLECTION_NAME]

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get("message", "")
        bot_response = get_bot_response(user_message, LOW_STOCK_THRESHOLD, EXCESS_STOCK_THRESHOLD)
        return jsonify({"response": bot_response})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal server error"}), 500


def check_stock_levels():
    """Check stock levels and send email alerts if needed."""
    # print("Starting stock level check...")
    df = inventory.load_inventory_data()
    # print("Inventory data loaded. DataFrame empty:", df.empty)
    if df.empty:
        print("No inventory data found. Exiting check_stock_levels.")
        return
    
    low_stock_threshold = 50
    excess_stock_threshold = 100
    
    low_stock_items = df[df['quantity'] < low_stock_threshold]
    excess_stock_items = df[df['quantity'] > excess_stock_threshold]
    # print("Found low stock items count:", len(low_stock_items))
    # print("Found excess stock items count:", len(excess_stock_items))
    
    # Send low stock alerts
    for _, row in low_stock_items.iterrows():
        store_email = row.get("storeEmail")
        # print(f"Processing low stock alert for: {row.get('title')}. Store email: {store_email}")
        if store_email:
            subject = f"Low Stock Alert: {row['title']}"
            body = (f"Dear Store,\n\nThe product '{row['title']}' has a current stock of {row['quantity']}, "
                    f"which is below the low stock threshold of {low_stock_threshold}.\nPlease restock at the earliest.")
            mail_alerts.send_email_notification(subject, body, store_email)
            # print(f"Low stock email sent to: {store_email}")
        else:
            print(f"No store email provided for: {row.get('title')}")
    
    # Send excess stock alerts
    for _, row in excess_stock_items.iterrows():
        store_email = row.get("storeEmail")
        # print(f"Processing excess stock alert for: {row.get('title')}. Store email: {store_email}")
        if store_email:
            subject = f"Excess Stock Alert: {row['title']}"
            body = (f"Dear Store,\n\nThe product '{row['title']}' has a current stock of {row['quantity']}, "
                    f"which is above the excess stock threshold of {excess_stock_threshold}.\nConsider promotional actions.")
            mail_alerts.send_email_notification(subject, body, store_email)
            # print(f"Excess stock email sent to: {store_email}")
        else:
            print(f"No store email provided for: {row.get('title')}")

# Schedule stock check every 5 minutes
scheduler.add_job(check_stock_levels, "interval", minutes=1)

@app.route("/check_stock", methods=["GET"])
def trigger_stock_check():
    """API endpoint to manually trigger stock checking."""
    thread = Thread(target=check_stock_levels)
    thread.start()
    return jsonify({"message": "Stock check initiated."})

@app.route("/inventory", methods=["GET"])
def get_inventory():
    """API endpoint to fetch current inventory data."""
    df = inventory.load_inventory_data()
    return df.to_json(orient='records')

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)
