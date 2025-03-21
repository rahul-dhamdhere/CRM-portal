from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Initialize Database for Clients
def init_db():
    try:
        conn = sqlite3.connect("crm.db", check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS clients (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT,
                phone TEXT,
                company TEXT,
                created_at TEXT NOT NULL
            )
        ''')
        conn.commit()
    except sqlite3.Error as e:
        print(f"Database initialization error: {e}")
    finally:
        if conn:
            conn.close()

init_db()

# Fetch all clients
@app.route('/api/clients', methods=['GET'])
def get_clients():
    try:
        conn = sqlite3.connect("crm.db", check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM clients")
        clients = [{"id": row[0], "name": row[1], "email": row[2], "phone": row[3], "company": row[4], "created_at": row[5]} for row in cursor.fetchall()]
        return jsonify(clients)
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

# Add a new client
@app.route('/api/clients', methods=['POST'])
def add_client():
    try:
        # Parse form data
        name = request.form.get('name')
        email = request.form.get('email')
        phone = request.form.get('phone')
        company = request.form.get('company')
        created_at = request.form.get('created_at')

        # Validate required fields
        if not name or not created_at:
            return jsonify({"error": "Missing required fields"}), 400

        # Validate date format (YYYY-MM-DD)
        try:
            datetime.strptime(created_at, "%Y-%m-%d")
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

        # Handle file uploads (optional)
        profile_picture = request.files.get('profilePicture')
        company_logo = request.files.get('companyLogo')

        # Save files if provided (optional)
        if profile_picture:
            profile_picture.save(f"./uploads/{profile_picture.filename}")
        if company_logo:
            company_logo.save(f"./uploads/{company_logo.filename}")

        # Generate a unique ID for the client
        client_id = str(uuid.uuid4())

        # Insert client data into the database
        new_client = (client_id, name, email, phone, company, created_at)
        conn = sqlite3.connect("crm.db", check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO clients (id, name, email, phone, company, created_at) VALUES (?, ?, ?, ?, ?, ?)", new_client)
        conn.commit()

        return jsonify({"message": "Client added successfully", "client": {"id": client_id, "name": name}}), 201
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