from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql

app = Flask(__name__)
CORS(app)

# Database connection
db = pymysql.connect(
    host='localhost',
    user='root',         
    password='Abhi@123', 
    database='auth_system'
)

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    companyName = data.get('companyName')
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')  # Storing plain text password

    try:
        with db.cursor() as cursor:
            sql = "INSERT INTO members (companyName, name, email, password) VALUES (%s, %s, %s, %s)"
            cursor.execute(sql, (companyName, name, email, password))
            db.commit()

        return jsonify({'message': 'Signup successful!'}), 201

    except pymysql.IntegrityError:
        return jsonify({'error': 'Email already exists.'}), 400

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    try:
        with db.cursor() as cursor:
            sql = "SELECT password FROM members WHERE email = %s"
            cursor.execute(sql, (email,))
            result = cursor.fetchone()

            if result:
                stored_password = result[0]  # Fetched plain text password

                # Directly compare passwords (insecure but as per your request)
                if password == stored_password:
                    return jsonify({'message': 'Login successful!'}), 200
                else:
                    return jsonify({'error': 'Invalid credentials.'}), 401

            return jsonify({'error': 'User not found.'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
