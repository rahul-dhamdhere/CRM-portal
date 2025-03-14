from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Database Initialization
def init_db():
    try:
        conn = sqlite3.connect("leads.db", check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS leads (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                owner TEXT NOT NULL,
                addedBy TEXT NOT NULL,
                created TEXT NOT NULL
            )
        ''')
        conn.commit()
    except sqlite3.Error as e:
        print(f"Database initialization error: {e}")
    finally:
        if conn:
            conn.close()

init_db()  # Initialize database on startup

# Fetch all leads
@app.route('/api/leads', methods=['GET'])
def get_leads():
    try:
        conn = sqlite3.connect("leads.db", check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM leads")
        leads = [{"id": row[0], "name": row[1], "owner": row[2], "addedBy": row[3], "created": row[4]} for row in cursor.fetchall()]
        return jsonify(leads)
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

# Add a new lead
@app.route('/api/leads', methods=['POST'])
def add_lead():
    data = request.json

    # Validate required fields
    required_fields = ["name", "leadOwner", "addedBy", "created"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    # Validate date format (YYYY-MM-DD)
    try:
        datetime.strptime(data["created"], "%Y-%m-%d")
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

    lead_id = str(uuid.uuid4())  # Generate a unique ID
    new_lead = (lead_id, data["name"], data["leadOwner"], data["addedBy"], data["created"])

    try:
        conn = sqlite3.connect("leads.db", check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO leads (id, name, owner, addedBy, created) VALUES (?, ?, ?, ?, ?)", new_lead)
        conn.commit()
        return jsonify({"message": "Lead added successfully", "lead": {"id": lead_id, "name": data["name"]}}), 201
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

# Error handler for 404
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Resource not found"}), 404

# Error handler for 500
@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True)