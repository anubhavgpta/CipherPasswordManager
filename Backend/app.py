# pylint: disable=missing-module-docstring
import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from cryptography.fernet import Fernet

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cipher.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize DB
db = SQLAlchemy(app)

# Generate a key if not already created
KEY_FILE = 'secret.key'
if not os.path.exists(KEY_FILE):
    with open(KEY_FILE, 'wb') as key_file:
        key_file.write(Fernet.generate_key())

# Load encryption key
with open(KEY_FILE, 'rb') as key_file:
    secret_key = key_file.read()

cipher = Fernet(secret_key)

# Models
class PasswordEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    site = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(100), nullable=False)  # Username for the site
    password_encrypted = db.Column(db.LargeBinary, nullable=False)
    owner_username = db.Column(db.String(100), nullable=False)  # Who owns this entry

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_encrypted = db.Column(db.LargeBinary, nullable=False)

# Create DB tables
with app.app_context():
    db.create_all()

# Routes
@app.route('/')
def home():
    return "Welcome to the Cipher Password Manager API!"

@app.route('/api/save', methods=['POST'])
def save_password():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No JSON data provided'}), 400
        
    print(f"Received data: {data}")

    site = data.get('site')
    username = data.get('username')  # Username for the site
    password = data.get('password')
    owner_username = data.get('owner_username')  # Who owns this password entry

    # Check if all required fields are present
    if not site or not username or not password or not owner_username:
        print(f"Missing required data: site={site}, username={username}, password={password}, owner_username={owner_username}")
        return jsonify({'error': 'site, username, password, and owner_username are required'}), 400

    try:
        # Encrypt the password
        encrypted_password = cipher.encrypt(password.encode())
        print(f"Password encrypted successfully")

        # Create new password entry
        entry = PasswordEntry(
            site=site, 
            username=username, 
            password_encrypted=encrypted_password,
            owner_username=owner_username
        )
        
        # Add the entry to the database
        db.session.add(entry)
        db.session.commit()
        print(f"Password entry saved successfully for site: {site}")
        return jsonify({'message': 'Password saved successfully'}), 201
        
    except Exception as e:
        print(f"Error saving entry: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Failed to save password'}), 500

@app.route('/api/get', methods=['GET'])
def get_passwords():
    owner_username = request.args.get('username')  # Get from URL parameters

    if not owner_username:
        return jsonify({'error': 'Username parameter required'}), 400

    try:
        # Get all entries belonging to this user
        entries = PasswordEntry.query.filter_by(owner_username=owner_username).all()
        results = []
        
        for entry in entries:
            decrypted_password = cipher.decrypt(entry.password_encrypted).decode()
            results.append({
                'id': entry.id,
                'site': entry.site,
                'username': entry.username,  # Site username
                'password': decrypted_password
            })
        
        print(f"Retrieved {len(results)} password entries for user: {owner_username}")
        return jsonify(results), 200
        
    except Exception as e:
        print(f"Error retrieving passwords: {str(e)}")
        return jsonify({'error': 'Failed to retrieve passwords'}), 500

@app.route('/api/delete/<int:entry_id>', methods=['DELETE'])
def delete_entry(entry_id):
    try:
        entry = PasswordEntry.query.get(entry_id)
        if entry:
            db.session.delete(entry)
            db.session.commit()
            print(f"Entry with id {entry_id} deleted successfully")
            return jsonify({'message': f'Entry with id {entry_id} deleted.'}), 200
        else:
            return jsonify({'error': 'Entry not found'}), 404
            
    except Exception as e:
        print(f"Error deleting entry: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Failed to delete entry'}), 500

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No JSON data provided'}), 400
        
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400

    try:
        # Check if user already exists
        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'User already exists'}), 409

        # Encrypt password and create user
        encrypted_password = cipher.encrypt(password.encode())
        user = User(username=username, password_encrypted=encrypted_password)
        
        db.session.add(user)
        db.session.commit()
        
        print(f"User created successfully: {username}")
        return jsonify({'message': 'User created successfully'}), 201
        
    except Exception as e:
        print(f"Error creating user: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Failed to create user'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No JSON data provided'}), 400
        
    username = data.get('username')
    password = data.get('password')

    print(f"Login attempt for username: {username}")

    if not username or not password:
        return jsonify({'message': 'Username and password required'}), 400

    try:
        user = User.query.filter_by(username=username).first()

        if user:
            decrypted_password = cipher.decrypt(user.password_encrypted).decode()
            if password == decrypted_password:
                print(f"Login successful for user: {username}")
                return jsonify({'message': 'Login successful', 'username': username}), 200
            else:
                print(f"Incorrect password for user: {username}")
                return jsonify({'message': 'Incorrect password'}), 401
        else:
            print(f"User not found: {username}")
            return jsonify({'message': 'User not found'}), 404
            
    except Exception as e:
        print(f"Error during login: {str(e)}")
        return jsonify({'message': 'Server error during login'}), 500

@app.route('/api/delete-account', methods=['DELETE'])
def delete_account():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No JSON data provided'}), 400
        
    username = data.get('username')

    if not username:
        return jsonify({'error': 'Username required'}), 400

    try:
        # Find the user
        user = User.query.filter_by(username=username).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Delete all password entries belonging to this user
        PasswordEntry.query.filter_by(owner_username=username).delete()
        
        # Delete the user account
        db.session.delete(user)
        db.session.commit()
        
        print(f"Account deleted successfully: {username}")
        return jsonify({'message': 'Account deleted successfully'}), 200
        
    except Exception as e:
        print(f"Error deleting account: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Failed to delete account'}), 500

@app.route('/api/forgot-password', methods=['PUT'])
def forgot_password():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No JSON data provided'}), 400
        
    username = data.get('username')
    new_password = data.get('new_password')
    confirm_password = data.get('confirm_password')

    print(f"Forgot password request for username: {username}")

    # Validate required fields
    if not username or not new_password or not confirm_password:
        return jsonify({'error': 'Username, new password, and confirmation are required'}), 400

    # Check if new passwords match
    if new_password != confirm_password:
        return jsonify({'error': 'New password and confirmation do not match'}), 400

    # Basic password strength validation
    if len(new_password) < 8:
        return jsonify({'error': 'New password must be at least 8 characters long'}), 400

    try:
        # Find the user
        user = User.query.filter_by(username=username).first()
        if not user:
            print(f"User not found: {username}")
            return jsonify({'error': 'User not found'}), 404

        # Encrypt new password and update user
        encrypted_new_password = cipher.encrypt(new_password.encode())
        user.password_encrypted = encrypted_new_password
        
        db.session.commit()
        
        print(f"Password reset successfully for user: {username}")
        return jsonify({'message': 'Password reset successfully'}), 200
        
    except Exception as e:
        print(f"Error resetting password: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Failed to reset password'}), 500
    
if __name__ == '__main__':
    app.run(debug=True)