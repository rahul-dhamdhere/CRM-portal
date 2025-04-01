from flask import Flask, request, jsonify, send_file, after_this_request
from flask_cors import CORS
import sqlite3
import uuid
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
CORS(app)

# Ensure uploads directory exists
UPLOAD_DIR = "./uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Initialize Databases
def init_client_db():
    try:
        conn = sqlite3.connect("crm.db", check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS clients (
            id TEXT PRIMARY KEY,
            salutation TEXT,
            name TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            gender TEXT,
            language TEXT,
            client_category TEXT,
            client_sub_category TEXT,
            login_allowed TEXT,
            email_notifications TEXT,
            profile_picture TEXT,
            company_name TEXT,
            website TEXT,
            tax_name TEXT,
            gst_number TEXT,
            company_address TEXT,
            office_phone_number TEXT,
            city TEXT,
            state TEXT,
            postal_code TEXT,
            added_by TEXT,
            shipping_address TEXT,
            note TEXT,
            company_logo TEXT
        )''')
        conn.commit()
    except sqlite3.Error as e:
        print(f"Client DB initialization error: {e}")
    finally:
        if conn:
            conn.close()

def init_lead_db():
    try:
        conn = sqlite3.connect("leads.db", check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS leads (
            id TEXT PRIMARY KEY,
            salutation TEXT,
            name TEXT NOT NULL,
            email TEXT,
            dealName TEXT,
            pipeline TEXT,
            dealStage TEXT,
            dealValue TEXT,
            closeDate TEXT,
            product TEXT,
            companyName TEXT,
            website TEXT,
            mobile TEXT,
            officePhone TEXT,
            country TEXT,
            state TEXT,
            city TEXT,
            postalCode TEXT,
            address TEXT,
            owner TEXT NOT NULL,
            addedBy TEXT NOT NULL,
            created TEXT NOT NULL
        )''')
        conn.commit()
    except sqlite3.Error as e:
        print(f"Lead DB initialization error: {e}")
    finally:
        if conn:
            conn.close()

def init_notifications_db():
    conn = sqlite3.connect('notifications.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            time TEXT NOT NULL
        )
    ''')
    conn.commit()

    # Insert default notifications if the table is empty
    cursor.execute('SELECT COUNT(*) FROM notifications')
    if cursor.fetchone()[0] == 0:
        default_notifications = [
        
            {"title": "Important Notice: New Update Published", "message": "Reporting Process and Escalation Cycle", "time": "1 week ago"}
        ]
        cursor.executemany(
            'INSERT INTO notifications (title, message, time) VALUES (?, ?, ?)',
            [(notif["title"], notif["message"], notif["time"]) for notif in default_notifications]
        )
        conn.commit()

    conn.close()

def init_archived_notifications_db():
    conn = sqlite3.connect('notifications.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS archived_notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            time TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def add_notification(title, message, time):
    conn = sqlite3.connect('notifications.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO notifications (title, message, time) VALUES (?, ?, ?)', (title, message, time))
    conn.commit()
    conn.close()

def init_auth_db():
    try:
        conn = sqlite3.connect("auth_system.db", check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            companyName TEXT NOT NULL,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )''')
        conn.commit()
    except sqlite3.Error as e:
        print(f"Auth DB initialization error: {e}")
    finally:
        if conn:
            conn.close()

init_client_db()
init_lead_db()
init_notifications_db()
init_archived_notifications_db()
init_auth_db()

# Authentication Routes
@app.route('/auth/signup', methods=['POST'])
def signup():
    data = request.json
    companyName = data.get('companyName')
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    # Hash the password before storing it
    hashed_password = generate_password_hash(password)

    try:
        conn = sqlite3.connect("auth_system.db", check_same_thread=False)
        cursor = conn.cursor()
        sql = "INSERT INTO members (companyName, name, email, password) VALUES (?, ?, ?, ?)"
        cursor.execute(sql, (companyName, name, email, hashed_password))
        conn.commit()
        return jsonify({'message': 'Signup successful!'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Email already exists.'}), 400
    except sqlite3.Error as e:
        return jsonify({'error': f"Database error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    try:
        conn = sqlite3.connect("auth_system.db", check_same_thread=False)
        cursor = conn.cursor()
        sql = "SELECT password FROM members WHERE email = ?"
        cursor.execute(sql, (email,))
        result = cursor.fetchone()

        if result:
            stored_password = result[0]

            # Verify the hashed password
            if check_password_hash(stored_password, password):
                return jsonify({'message': 'Login successful!'}), 200
            else:
                return jsonify({'error': 'Invalid credentials.'}), 401

        return jsonify({'error': 'User not found.'}), 404
    except sqlite3.Error as e:
        return jsonify({'error': f"Database error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

# Client API Routes
@app.route('/api/clients', methods=['GET'])
def get_clients():
    try:
        conn = sqlite3.connect("crm.db", check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM clients")
        clients = [
            {
                "id": row[0],
                "salutation": row[1],
                "name": row[2],
                "email": row[3],
                "phone": row[4],
                "gender": row[5],
                "language": row[6],
                "client_category": row[7],
                "client_sub_category": row[8],
                "login_allowed": row[9],
                "email_notifications": row[10],
                "profile_picture": f"http://localhost:5000/{row[11]}" if row[11] else None,
                "company_name": row[12],
                "website": row[13],
                "tax_name": row[14],
                "gst_number": row[15],
                "company_address": row[16],
                "office_phone_number": row[17],
                "city": row[18],
                "state": row[19],
                "postal_code": row[20],
                "added_by": row[21],
                "shipping_address": row[22],
                "note": row[23],
                "company_logo": f"http://localhost:5000/{row[24]}" if row[24] else None
            }
            for row in cursor.fetchall()
        ]
        return jsonify(clients)
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

@app.route('/api/clients', methods=['POST'])
def add_client():
    try:
        data = request.form  # Use form data for file uploads
        client_id = str(uuid.uuid4())

        # Handle file uploads
        profile_picture = request.files.get('profilePicture')
        company_logo = request.files.get('companyLogo')

        profile_picture_path = None
        company_logo_path = None

        if profile_picture:
            profile_picture_path = os.path.join(UPLOAD_DIR, profile_picture.filename)
            profile_picture.save(profile_picture_path)

        if company_logo:
            company_logo_path = os.path.join(UPLOAD_DIR, company_logo.filename)
            company_logo.save(company_logo_path)

        conn = sqlite3.connect("crm.db", check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute('''INSERT INTO clients (
            id, salutation, name, email, phone, gender, language, client_category, client_sub_category, login_allowed,
            email_notifications, profile_picture, company_name, website, tax_name, gst_number, company_address,
            office_phone_number, city, state, postal_code, added_by, shipping_address, note, company_logo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''', (
            client_id, data.get('salutation'), data['name'], data.get('email'), data.get('phone'), data.get('gender'),
            data.get('language'), data.get('clientCategory'), data.get('clientSubCategory'), data.get('loginAllowed'),
            data.get('emailNotifications'), profile_picture_path, data.get('companyName'), data.get('website'),
            data.get('taxName'), data.get('gstNumber'), data.get('companyAddress'), data.get('officePhoneNumber'),
            data.get('city'), data.get('state'), data.get('postalCode'), data.get('addedBy'), data.get('shippingAddress'),
            data.get('note'), company_logo_path
        ))
        conn.commit()
        return jsonify({"message": "Client added successfully & please refresh the page to see notification", "client": {"id": client_id, **data}}), 201
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    finally:
        if conn:
            conn.close()

@app.route('/api/clients/<client_id>', methods=['PUT'])
def update_client(client_id):
    try:
        data = request.json
        conn = sqlite3.connect("crm.db", check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute('''UPDATE clients SET
            salutation = ?, name = ?, email = ?, phone = ?, gender = ?, language = ?, client_category = ?, 
            client_sub_category = ?, login_allowed = ?, email_notifications = ?, company_name = ?, website = ?, 
            tax_name = ?, gst_number = ?, company_address = ?, office_phone_number = ?, city = ?, state = ?, 
            postal_code = ?, added_by = ?, shipping_address = ?, note = ?
            WHERE id = ?''', (
            data.get('salutation'), data['name'], data.get('email'), data.get('phone'), data.get('gender'),
            data.get('language'), data.get('client_category'), data.get('client_sub_category'),
            data.get('login_allowed'), data.get('email_notifications'), data.get('company_name'),
            data.get('website'), data.get('tax_name'), data.get('gst_number'), data.get('company_address'),
            data.get('office_phone_number'), data.get('city'), data.get('state'), data.get('postal_code'),
            data.get('added_by'), data.get('shipping_address'), data.get('note'), client_id
        ))
        if cursor.rowcount == 0:
            return jsonify({"error": "Client not found"}), 404
        conn.commit()
        return jsonify({"message": "Client updated successfully", "client": data}), 200
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

@app.route('/api/clients/<client_id>', methods=['DELETE'])
def delete_client(client_id):
    try:
        conn = sqlite3.connect("crm.db", check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM clients WHERE id = ?", (client_id,))
        if cursor.rowcount == 0:
            return jsonify({"error": "Client not found"}), 404
        conn.commit()
        return jsonify({"message": "Client deleted successfully"}), 200
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

@app.route('/api/clients/export', methods=['GET'])
def export_clients():
    # ...existing code from combined_api.py...
    pass

# Lead API Routes
@app.route('/api/leads', methods=['GET'])
def get_leads():
    try:
        conn = sqlite3.connect("leads.db", check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM leads")
        leads = [
            {
                "id": row[0],
                "salutation": row[1],
                "name": row[2],
                "email": row[3],
                "dealName": row[4],
                "pipeline": row[5],
                "dealStage": row[6],
                "dealValue": row[7],
                "closeDate": row[8],
                "product": row[9],
                "companyName": row[10],
                "website": row[11],
                "mobile": row[12],
                "officePhone": row[13],
                "country": row[14],
                "state": row[15],
                "city": row[16],
                "postalCode": row[17],
                "address": row[18],
                "owner": row[19],
                "addedBy": row[20],
                "created": row[21]
            }
            for row in cursor.fetchall()
        ]
        return jsonify(leads)
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

@app.route('/api/leads', methods=['POST'])
def add_lead():
    try:
        data = request.json  # Use JSON data for leads
        lead_id = str(uuid.uuid4())

        # Validate required fields
        required_fields = ["name", "dealName", "pipeline", "dealStage", "dealValue", "closeDate", "owner", "addedBy", "created"]
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"Missing required field: {field}"}), 400

        conn = sqlite3.connect("leads.db", check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute('''INSERT INTO leads (
            id, salutation, name, email, dealName, pipeline, dealStage, dealValue, closeDate, product,
            companyName, website, mobile, officePhone, country, state, city, postalCode, address, owner,
            addedBy, created
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''', (
            lead_id, data.get('salutation'), data['name'], data.get('email'), data['dealName'],
            data['pipeline'], data['dealStage'], data['dealValue'], data['closeDate'],
            data.get('product'), data.get('companyName'), data.get('website'), data.get('mobile'),
            data.get('officePhone'), data.get('country'), data.get('state'), data.get('city'),
            data.get('postalCode'), data.get('address'), data['owner'], data['addedBy'], data['created']
        ))
        conn.commit()
        return jsonify({"message": "Lead added successfully & please refresh the page to see notification", "lead": {"id": lead_id, **data}}), 201
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    finally:
        if conn:
            conn.close()

@app.route('/api/leads/<lead_id>', methods=['PUT'])
def update_lead(lead_id):
    try:
        data = request.json
        conn = sqlite3.connect("leads.db", check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute('''UPDATE leads SET
            salutation = ?, name = ?, email = ?, dealName = ?, pipeline = ?, dealStage = ?, dealValue = ?, 
            closeDate = ?, product = ?, companyName = ?, website = ?, mobile = ?, officePhone = ?, country = ?, 
            state = ?, city = ?, postalCode = ?, address = ?, owner = ?, addedBy = ?, created = ?
            WHERE id = ?''', (
            data.get('salutation'), data['name'], data.get('email'), data['dealName'], data['pipeline'],
            data['dealStage'], data['dealValue'], data['closeDate'], data.get('product'), data.get('companyName'),
            data.get('website'), data.get('mobile'), data.get('officePhone'), data.get('country'), data.get('state'),
            data.get('city'), data.get('postalCode'), data.get('address'), data['owner'], data['addedBy'],
            data['created'], lead_id
        ))
        if cursor.rowcount == 0:
            return jsonify({"error": "Lead not found"}), 404
        conn.commit()
        return jsonify({"message": "Lead updated successfully", "lead": data}), 200
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

@app.route('/api/leads/<lead_id>', methods=['DELETE'])
def delete_lead(lead_id):
    try:
        conn = sqlite3.connect("leads.db", check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM leads WHERE id = ?", (lead_id,))
        if cursor.rowcount == 0:
            return jsonify({"error": "Lead not found"}), 404
        conn.commit()
        return jsonify({"message": "Lead deleted successfully"}), 200
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

@app.route('/api/leads/export', methods=['GET'])
def export_leads():
    # ...existing code from combined_api.py...
    pass

# Notifications API Routes
@app.route('/api/notifications', methods=['GET'])
def get_notifications():
    conn = sqlite3.connect('notifications.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, title, message, time FROM notifications ORDER BY id DESC')
    notifications = [{'id': row[0], 'title': row[1], 'message': row[2], 'time': row[3]} for row in cursor.fetchall()]
    conn.close()
    return jsonify(notifications)

@app.route('/api/notifications', methods=['POST'])
def create_notification():
    data = request.json
    title = data.get('title')
    message = data.get('message')
    time = data.get('time')
    add_notification(title, message, time)
    return jsonify({'message': 'Notification added successfully'}), 201

@app.route('/api/notifications/mark-as-read', methods=['POST'])
def mark_notifications_as_read():
    try:
        conn = sqlite3.connect('notifications.db')
        cursor = conn.cursor()
        # Move notifications to the archived table
        cursor.execute('INSERT INTO archived_notifications SELECT * FROM notifications')
        cursor.execute('DELETE FROM notifications')  # Clear current notifications
        conn.commit()
        return jsonify({'message': 'All notifications marked as read'}), 200
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

@app.route('/api/notifications/all', methods=['GET'])
def get_all_notifications():
    try:
        conn = sqlite3.connect('notifications.db')
        cursor = conn.cursor()
        # Fetch both current and archived notifications
        cursor.execute('SELECT id, title, message, time FROM notifications UNION ALL SELECT id, title, message, time FROM archived_notifications ORDER BY id DESC')
        notifications = [{'id': row[0], 'title': row[1], 'message': row[2], 'time': row[3]} for row in cursor.fetchall()]
        return jsonify(notifications)
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

# Error Handlers
@app.errorhandler(404)
def not_found(error):
    # ...existing code from combined_api.py...
    pass

@app.errorhandler(500)
def internal_server_error(error):
    # ...existing code from combined_api.py...
    pass

if __name__ == '__main__':
    app.run(debug=True)
