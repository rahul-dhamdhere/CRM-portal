from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import hashlib
import secrets

app = Flask(__name__)
CORS(app)

def get_db():
    conn = sqlite3.connect('users.db')
    conn.row_factory = sqlite3.Row
    return conn

def create_user_table():
    conn = get_db()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company_name TEXT,
            name TEXT,
            email TEXT UNIQUE,
            password_hash TEXT
        )
    ''')
    conn.commit()
    conn.close()

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@app.route('/auth/signup', methods=['POST'])
def signup():
    data = request.json
    print("Signup data received:", data)  # Debug print
    company_name = data.get('companyName')
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    if not (company_name and name and email and password):
        print("Signup error: Missing fields")  # Debug print
        return jsonify({'error': 'All fields are required.'}), 400
    conn = get_db()
    try:
        conn.execute(
            'INSERT INTO users (company_name, name, email, password_hash) VALUES (?, ?, ?, ?)',
            (company_name, name, email, hash_password(password))
        )
        conn.commit()
        print("Signup success for:", email)  # Debug print
        return jsonify({'message': 'Signup successful!'})
    except sqlite3.IntegrityError as e:
        print("Signup error: IntegrityError", e)  # Debug print
        return jsonify({'error': 'Email already exists.'}), 400
    except Exception as e:
        print("Signup error:", e)  # Debug print
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    if not (email and password):
        return jsonify({'error': 'Email and password required.'}), 400
    conn = get_db()
    user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    conn.close()
    if user and user['password_hash'] == hash_password(password):
        token = secrets.token_hex(16)
        return jsonify({'message': 'Login successful!', 'token': token})
    else:
        return jsonify({'error': 'Invalid credentials.'}), 401

if __name__ == '__main__':
    create_user_table()
    app.run(port=5000, debug=True)
