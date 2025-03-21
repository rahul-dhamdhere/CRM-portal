from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

# Create a Blueprint for authentication routes
auth_bp = Blueprint('auth', __name__)

# Initialize SQLite database
def init_db():
    try:
        conn = sqlite3.connect("auth_system.db")  # Creates 'auth_system.db' in the folder if it doesn't exist
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS members (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                companyName TEXT NOT NULL,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        ''')
        conn.commit()
    except sqlite3.Error as e:
        print(f"Database initialization error: {e}")
    finally:
        if conn:
            conn.close()

# Call the database initialization function
init_db()

# Signup Route
@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    companyName = data.get('companyName')
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    # Hash the password before storing it
    hashed_password = generate_password_hash(password)

    try:
        conn = sqlite3.connect("auth_system.db")
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

# Login Route
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    try:
        conn = sqlite3.connect("auth_system.db")
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

# Register the Blueprint with the /auth prefix
app.register_blueprint(auth_bp, url_prefix='/auth')

if __name__ == '__main__':
    app.run(debug=True)
