from flask import Flask, request, jsonify, send_file  # Add send_file for file download
from flask_cors import CORS
import sqlite3
import uuid
from datetime import datetime
from fpdf import FPDF  # Add this import for PDF generation

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
    new_lead = (
        lead_id,
        data.get("salutation"),
        data["name"],
        data.get("email"),
        data.get("dealName"),
        data.get("pipeline"),
        data.get("dealStage"),
        data.get("dealValue"),
        data.get("closeDate"),
        data.get("product"),
        data.get("companyName"),
        data.get("website"),
        data.get("mobile"),
        data.get("officePhone"),
        data.get("country"),
        data.get("state"),
        data.get("city"),
        data.get("postalCode"),
        data.get("address"),
        data["leadOwner"],
        data["addedBy"],
        data["created"]
    )

    try:
        conn = sqlite3.connect("leads.db", check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO leads (
                id, salutation, name, email, dealName, pipeline, dealStage, dealValue, closeDate, product,
                companyName, website, mobile, officePhone, country, state, city, postalCode, address,
                owner, addedBy, created
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', new_lead)
        conn.commit()
        return jsonify({"message": "Lead added successfully", "lead": {"id": lead_id, "name": data["name"]}}), 201
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

# Delete a lead
@app.route('/api/leads/<lead_id>', methods=['DELETE'])
def delete_lead(lead_id):
    try:
        conn = sqlite3.connect("leads.db", check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM leads WHERE id = ?", (lead_id,))
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({"error": "Lead not found"}), 404
        return jsonify({"message": "Lead deleted successfully"}), 200
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

# Export leads as PDF
@app.route('/api/leads/export', methods=['GET'])
def export_leads():
    try:
        conn = sqlite3.connect("leads.db", check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute("SELECT name, owner, addedBy, created FROM leads")  # Fetch only relevant fields
        leads = cursor.fetchall()

        # Create a PDF
        pdf = FPDF()
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.add_page()
        pdf.set_font("Arial", size=12)

        # Add a title
        pdf.set_font("Arial", style="B", size=16)
        pdf.cell(0, 10, txt="Leads Export", ln=True, align="C")
        pdf.ln(10)

        # Add table headers
        headers = ["Contact Name", "Lead Owner", "Added By", "Created"]
        column_widths = [60, 60, 40, 30]  # Adjust column widths for neat alignment

        pdf.set_font("Arial", style="B", size=10)
        for i, header in enumerate(headers):
            pdf.cell(column_widths[i], 10, txt=header, border=1, align="C")
        pdf.ln()

        # Add table rows
        pdf.set_font("Arial", size=10)
        for row in leads:
            for i, col in enumerate(row):
                pdf.cell(column_widths[i], 10, txt=str(col), border=1, align="L")
            pdf.ln()

        # Save the PDF to a file
        pdf_file = "leads_export.pdf"
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