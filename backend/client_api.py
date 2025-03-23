from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import sqlite3
import uuid
from datetime import datetime
from fpdf import FPDF
import os

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
            )
        ''')  # Removed created_at column
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
                "profile_picture": f"http://localhost:5000/{row[11]}" if row[11] else None,  # Full URL for profile picture
                "company_name": row[12],  # Ensure company name is fetched
                "website": row[13],
                "tax_name": row[14],
                "gst_number": row[15],
                "company_address": row[16],  # Ensure company address is fetched
                "office_phone_number": row[17],
                "city": row[18],
                "state": row[19],
                "postal_code": row[20],
                "added_by": row[21],
                "shipping_address": row[22],
                "note": row[23],
                "company_logo": f"http://localhost:5000/{row[24]}" if row[24] else None  # Full URL for company logo
            }
            for row in cursor.fetchall()
        ]  # Removed created_at field
        print("Fetched Clients:", clients)  # Log fetched clients for debugging
        return jsonify(clients)
    except sqlite3.Error as e:
        print("Database Error:", str(e))  # Log database error
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

# Add a new client
@app.route('/api/clients', methods=['POST'])
def add_client():
    try:
        # Ensure the uploads directory exists
        os.makedirs("./uploads", exist_ok=True)

        # Parse form data
        salutation = request.form.get('salutation')
        name = request.form.get('name')
        email = request.form.get('email')
        phone = request.form.get('phone')
        gender = request.form.get('gender')
        language = request.form.get('language')
        client_category = request.form.get('clientCategory')
        client_sub_category = request.form.get('clientSubCategory')
        login_allowed = request.form.get('loginAllowed')
        email_notifications = request.form.get('emailNotifications')
        company_name = request.form.get('companyName')  # Fetch company name
        website = request.form.get('website')
        tax_name = request.form.get('taxName')
        gst_number = request.form.get('gstNumber')
        company_address = request.form.get('companyAddress')  # Fetch company address
        office_phone_number = request.form.get('officePhoneNumber')
        city = request.form.get('city')
        state = request.form.get('state')
        postal_code = request.form.get('postalCode')
        added_by = request.form.get('addedBy')
        shipping_address = request.form.get('shippingAddress')
        note = request.form.get('note')  # Fetch note field

        # Validate required fields
        if not name:
            return jsonify({"error": "Missing required fields"}), 400

        # Handle file uploads
        profile_picture = request.files.get('profilePicture')
        company_logo = request.files.get('companyLogo')

        profile_picture_path = None
        company_logo_path = None

        if profile_picture:
            profile_picture_path = f"./uploads/{profile_picture.filename}"
            profile_picture.save(profile_picture_path)

        if company_logo:
            company_logo_path = f"./uploads/{company_logo.filename}"
            company_logo.save(company_logo_path)

        # Generate a unique ID for the client
        client_id = str(uuid.uuid4())

        # Insert client data into the database
        new_client = (
            client_id, salutation, name, email, phone, gender, language, client_category, client_sub_category,
            login_allowed, email_notifications, profile_picture_path, company_name, website, tax_name, gst_number,
            company_address, office_phone_number, city, state, postal_code, added_by, shipping_address, note,
            company_logo_path
        )  # Removed created_at field
        conn = sqlite3.connect("crm.db", check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO clients (
                id, salutation, name, email, phone, gender, language, client_category, client_sub_category,
                login_allowed, email_notifications, profile_picture, company_name, website, tax_name, gst_number,
                company_address, office_phone_number, city, state, postal_code, added_by, shipping_address, note,
                company_logo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', new_client)  # Removed created_at field
        conn.commit()

        return jsonify({"message": "Client added successfully", "client": {"id": client_id, "name": name}}), 201
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

# Update a client
@app.route('/api/clients/<client_id>', methods=['PUT'])
def update_client(client_id):
    data = request.json  # Parse JSON data from the request

    # Validate required fields
    if not data.get("name"):
        return jsonify({"error": "Name is required"}), 400
    if not data.get("phone") or not data.get("phone").isdigit() or len(data.get("phone")) != 10:
        return jsonify({"error": "Phone number is required and must be a valid 10-digit number."}), 400

    try:
        conn = sqlite3.connect("crm.db", check_same_thread=False)
        cursor = conn.cursor()

        # Update the client in the database
        cursor.execute('''
            UPDATE clients
            SET salutation = ?, name = ?, email = ?, phone = ?, gender = ?, language = ?, client_category = ?,
                client_sub_category = ?, login_allowed = ?, email_notifications = ?, profile_picture = ?, company_name = ?,
                website = ?, tax_name = ?, gst_number = ?, company_address = ?, office_phone_number = ?, city = ?,
                state = ?, postal_code = ?, added_by = ?, shipping_address = ?, note = ?, company_logo = ?
            WHERE id = ?
        ''', (
            data.get("salutation"), data.get("name"), data.get("email"), data.get("phone"), data.get("gender"),
            data.get("language"), data.get("client_category"), data.get("client_sub_category"), data.get("login_allowed"),
            data.get("email_notifications"), data.get("profile_picture"), data.get("company_name"), data.get("website"),
            data.get("tax_name"), data.get("gst_number"), data.get("company_address"), data.get("office_phone_number"),
            data.get("city"), data.get("state"), data.get("postal_code"), data.get("added_by"),
            data.get("shipping_address"), data.get("note"), data.get("company_logo"), client_id
        ))
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"error": "Client not found"}), 404

        # Fetch updated client details
        cursor.execute("SELECT * FROM clients WHERE id = ?", (client_id,))
        updated_client = cursor.fetchone()
        if updated_client:
            client_data = {
                "id": updated_client[0],
                "salutation": updated_client[1],
                "name": updated_client[2],
                "email": updated_client[3],
                "phone": updated_client[4],
                "gender": updated_client[5],
                "language": updated_client[6],
                "client_category": updated_client[7],
                "client_sub_category": updated_client[8],
                "login_allowed": updated_client[9],
                "email_notifications": updated_client[10],
                "profile_picture": updated_client[11],
                "company_name": updated_client[12],
                "website": updated_client[13],
                "tax_name": updated_client[14],
                "gst_number": updated_client[15],
                "company_address": updated_client[16],
                "office_phone_number": updated_client[17],
                "city": updated_client[18],
                "state": updated_client[19],
                "postal_code": updated_client[20],
                "added_by": updated_client[21],
                "shipping_address": updated_client[22],
                "note": updated_client[23],
                "company_logo": updated_client[24]
            }
            return jsonify({"message": "Client updated successfully", "client": client_data}), 200
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

# Delete a client
@app.route('/api/clients/<client_id>', methods=['DELETE'])
def delete_client(client_id):
    try:
        conn = sqlite3.connect("crm.db", check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM clients WHERE id = ?", (client_id,))
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({"error": "Client not found"}), 404
        return jsonify({"message": "Client deleted successfully"}), 200
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

# Export clients as PDF
@app.route('/api/clients/export', methods=['GET'])
def export_clients():
    try:
        conn = sqlite3.connect("crm.db", check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute("SELECT name, email, phone, company_name FROM clients")  # Removed created_at field
        clients = cursor.fetchall()

        # Create a PDF
        pdf = FPDF()
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.add_page()
        pdf.set_font("Arial", size=12)

        # Add a title
        pdf.set_font("Arial", style="B", size=16)
        pdf.cell(0, 10, txt="Clients Export", ln=True, align="C")
        pdf.ln(10)

        # Add table headers
        headers = ["Name", "Email", "Phone", "Company"]  # Removed Created At header
        column_widths = [50, 50, 30, 50]  # Adjusted column widths

        pdf.set_font("Arial", style="B", size=10)
        for i, header in enumerate(headers):
            pdf.cell(column_widths[i], 10, txt=header, border=1, align="C")
        pdf.ln()

        # Add table rows
        pdf.set_font("Arial", size=10)
        for row in clients:
            for i, col in enumerate(row):
                # Truncate long text to fit within the column width
                text = str(col)[:int(column_widths[i] / 2)] + "..." if len(str(col)) > int(column_widths[i] / 2) else str(col)
                pdf.cell(column_widths[i], 10, txt=text, border=1, align="L")
            pdf.ln()

        # Save the PDF to a file
        pdf_file = "clients_export.pdf"
        pdf.output(pdf_file)

        # Serve the PDF as a downloadable file
        return send_file(pdf_file, as_attachment=True)
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