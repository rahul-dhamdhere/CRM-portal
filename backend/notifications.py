from flask import Flask, jsonify, request
import sqlite3

app = Flask(__name__)

# Initialize the database
def init_db():
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
            {"title": "Sahil Salunke", "message": "has a birthday on 1 Mar", "time": "1 day ago"},
            {"title": "Arya Vilas Tandale", "message": "has a birthday on 28 Feb", "time": "2 days ago"},
            {"title": "Tejas Ganesh Nikam", "message": "and 1 other have a birthday on 25 Feb", "time": "5 days ago"},
            {"title": "Ashwini Subhash Narwade", "message": "has a birthday on 22 Feb", "time": "1 week ago"},
            {"title": "Important Notice: New Update Published", "message": "Office Closure on 24th & 25th Feb 2025 – Work from Home", "time": "1 week ago"},
            {"title": "Important Notice: New Update Published", "message": "Reporting Process and Escalation Cycle", "time": "1 week ago"}
        ]
        cursor.executemany(
            'INSERT INTO notifications (title, message, time) VALUES (?, ?, ?)',
            [(notif["title"], notif["message"], notif["time"]) for notif in default_notifications]
        )
        conn.commit()

    conn.close()

# Add a notification to the database
def add_notification(title, message, time):
    conn = sqlite3.connect('notifications.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO notifications (title, message, time) VALUES (?, ?, ?)', (title, message, time))
    conn.commit()
    conn.close()

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

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
