from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import sqlite3
import uuid
from datetime import datetime
from fpdf import FPDF
import os

app = Flask(__name__)
CORS(app)

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

init_client_db()
init_lead_db()

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
        data = request.get_json()
        client_id = str(uuid.uuid4())
        conn = sqlite3.connect("crm.db", check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute('''INSERT INTO clients (
            id, salutation, name, email, phone, gender, language, client_category, client_sub_category, login_allowed,
            email_notifications, profile_picture, company_name, website, tax_name, gst_number, company_address,
            office_phone_number, city, state, postal_code, added_by, shipping_address, note, company_logo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''', (
            client_id, data.get('salutation'), data['name'], data.get('email'), data.get('phone'), data.get('gender'),
            data.get('language'), data.get('client_category'), data.get('client_sub_category'), data.get('login_allowed'),
            data.get('email_notifications'), data.get('profile_picture'), data.get('company_name'), data.get('website'),
            data.get('tax_name'), data.get('gst_number'), data.get('company_address'), data.get('office_phone_number'),
            data.get('city'), data.get('state'), data.get('postal_code'), data.get('added_by'), data.get('shipping_address'),
            data.get('note'), data.get('company_logo')
        ))
        conn.commit()
        return jsonify({"id": client_id}), 201
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

@app.route('/api/clients/<client_id>', methods=['PUT'])
def update_client(client_id):
    try:
        data = request.get_json()
        conn = sqlite3.connect("crm.db", check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute('''UPDATE clients SET
            salutation = ?, name = ?, email = ?, phone = ?, gender = ?, language = ?, client_category = ?, client_sub_category = ?,
            login_allowed = ?, email_notifications = ?, profile_picture = ?, company_name = ?, website = ?, tax_name = ?, gst_number = ?,
            company_address = ?, office_phone_number = ?, city = ?, state = ?, postal_code = ?, added_by = ?, shipping_address = ?,
            note = ?, company_logo = ?
            WHERE id = ?''', (
            data.get('salutation'), data['name'], data.get('email'), data.get('phone'), data.get('gender'), data.get('language'),
            data.get('client_category'), data.get('client_sub_category'), data.get('login_allowed'), data.get('email_notifications'),
            data.get('profile_picture'), data.get('company_name'), data.get('website'), data.get('tax_name'), data.get('gst_number'),
            data.get('company_address'), data.get('office_phone_number'), data.get('city'), data.get('state'), data.get('postal_code'),
            data.get('added_by'), data.get('shipping_address'), data.get('note'), data.get('company_logo'), client_id
        ))
        conn.commit()
        return jsonify({"message": "Client updated successfully"})
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
        conn.commit()
        return jsonify({"message": "Client deleted successfully"})
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

@app.route('/api/clients/export', methods=['GET'])
def export_clients():
    try:
        conn = sqlite3.connect("crm.db", check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM clients")
        clients = cursor.fetchall()

        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)

        for client in clients:
            pdf.cell(200, 10, txt=str(client), ln=True)

        pdf_output = "clients_export.pdf"
        pdf.output(pdf_output)

        return send_file(pdf_output, as_attachment=True)
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

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
        data = request.get_json()
        lead_id = str(uuid.uuid4())
        conn = sqlite3.connect("leads.db", check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute('''INSERT INTO leads (
            id, salutation, name, email, dealName, pipeline, dealStage, dealValue, closeDate, product, companyName, website,
            mobile, officePhone, country, state, city, postalCode, address, owner, addedBy, created
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''', (
            lead_id, data.get('salutation'), data['name'], data.get('email'), data.get('dealName'), data.get('pipeline'),
            data.get('dealStage'), data.get('dealValue'), data.get('closeDate'), data.get('product'), data.get('companyName'),
            data.get('website'), data.get('mobile'), data.get('officePhone'), data.get('country'), data.get('state'),
            data.get('city'), data.get('postalCode'), data.get('address'), data['owner'], data['addedBy'], data['created']
        ))
        conn.commit()
        return jsonify({"id": lead_id}), 201
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

@app.route('/api/leads/<lead_id>', methods=['PUT'])
def update_lead(lead_id):
    try:
        data = request.get_json()
        conn = sqlite3.connect("leads.db", check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute('''UPDATE leads SET
            salutation = ?, name = ?, email = ?, dealName = ?, pipeline = ?, dealStage = ?, dealValue = ?, closeDate = ?,
            product = ?, companyName = ?, website = ?, mobile = ?, officePhone = ?, country = ?, state = ?, city = ?, postalCode = ?,
            address = ?, owner = ?, addedBy = ?, created = ?
            WHERE id = ?''', (
            data.get('salutation'), data['name'], data.get('email'), data.get('dealName'), data.get('pipeline'), data.get('dealStage'),
            data.get('dealValue'), data.get('closeDate'), data.get('product'), data.get('companyName'), data.get('website'),
            data.get('mobile'), data.get('officePhone'), data.get('country'), data.get('state'), data.get('city'), data.get('postalCode'),
            data.get('address'), data['owner'], data['addedBy'], data['created'], lead_id
        ))
        conn.commit()
        return jsonify({"message": "Lead updated successfully"})
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
        conn.commit()
        return jsonify({"message": "Lead deleted successfully"})
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

@app.route('/api/leads/export', methods=['GET'])
def export_leads():
    try:
        conn = sqlite3.connect("leads.db", check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM leads")
        leads = cursor.fetchall()

        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)

        for lead in leads:
            pdf.cell(200, 10, txt=str(lead), ln=True)

        pdf_output = "leads_export.pdf"
        pdf.output(pdf_output)

        return send_file(pdf_output, as_attachment=True)
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

# Error Handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Resource not found"}), 404

@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True)
