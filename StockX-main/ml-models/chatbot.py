from groq import Groq
from dotenv import load_dotenv
import os
import pymongo
import pandas as pd

# Load environment variables
load_dotenv()
API_KEY = os.getenv("GROQ_API_KEY")
MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")

# Initialize Groq client
client = Groq(api_key=API_KEY)

# Connect to MongoDB
mongo_client = pymongo.MongoClient(MONGODB_URI)
db = mongo_client[DB_NAME]  # Replace with your actual database name
inventory_collection = db[COLLECTION_NAME]  # Replace with your actual collection name

def fetch_inventory_data():
    """Fetch inventory data from MongoDB and return as a Pandas DataFrame."""
    inventory_data = list(inventory_collection.find({}, {"_id": 0, "title": 1, "quantity": 1}))  # Fetch only relevant fields
    return pd.DataFrame(inventory_data)

def get_bot_response(query, low_threshold, excess_threshold):
    """
    Generate a chatbot response based on live inventory data from MongoDB.
    """
    df = fetch_inventory_data()  # Get real inventory data

    # Create a summary of inventory data (title and quantity only)
    inventory_summary = "\n".join([f"{row['title']}: {row['quantity']}" for _, row in df.iterrows()]) if not df.empty else "No inventory data available."

    # Construct chat messages
    messages = [
        {
            "role": "system",
            "content": (
                f"You are an inventory analytics assistant. Your responses must be based only on "
                f"the provided inventory data and threshold information. The low stock threshold is {low_threshold} "
                f"and the excess stock threshold is {excess_threshold}. Here is the current inventory data:\n"
                f"{inventory_summary}\n"
                "If the query asks about low stock, advise on reordering or restocking items below the threshold. "
                "If the query asks about excess stock, suggest discount or promotional strategies. "
                "Answer only based on this data."
            )
        },
        {
            "role": "user",
            "content": query
        }
    ]

    # Call Groq's chat completions API using streaming
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=1,
        max_completion_tokens=1024,
        top_p=1,
        stream=True,
        stop=None,
    )

    response = ""
    for chunk in completion:
        response += chunk.choices[0].delta.content or ""

    return response