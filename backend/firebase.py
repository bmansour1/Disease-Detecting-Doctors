import firebase_admin
from firebase_admin import credentials, firestore

# Use a service account
cred = credentials.Certificate('key.json') # Assuming you stored your key file as 'key.json' under backend/
firebase_admin.initialize_app(cred)
db = firestore.client()

def get_all_users():
    users = db.collection('users').stream()
    return {user.id: user.to_dict() for user in users} # Return the collection of users in dictionary format

def add_user(user_credentials):
    # Firestore auto-generates a document ID with add(); use document(custom_id).set(user_credentials) for custom IDs
    user_ref = db.collection('users').add(user_credentials)
    return user_ref[1].id  # Returns the Firestore Document ID of the new user

def edit_user(user_id, updated_credentials):
    user_ref = db.collection('users').document(user_id) 
    user_ref.update(updated_credentials) # update() does not require all the parameters, only the updated ones
    return f"User with ID {user_id} has been successfully updated."

def delete_user(user_id):
    db.collection('users').document(user_id).delete() # Delete by user_id
    return f"User with ID {user_id} has been successfully deleted."

