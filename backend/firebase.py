import firebase_admin
from firebase_admin import credentials, firestore

# Use a service account
cred = credentials.Certificate('key.json') # Assuming you stored your key file as 'key.json' under backend/
firebase_admin.initialize_app(cred)
db = firestore.client()

# User Accounts
def get_all_users():
    users = db.collection('Users').stream()
    return {user.id: user.to_dict() for user in users} # Return the collection of users in dictionary format

def add_user(user_credentials):
    # Firestore auto-generates a document ID with add(); use document(custom_id).set(user_credentials) for custom IDs
    user_ref = db.collection('Users').add(user_credentials)
    return user_ref[1].id  # Returns the Firestore Document ID of the new user

def edit_user(user_id, updated_credentials):
    user_ref = db.collection('Users').document(user_id) 
    user_ref.update(updated_credentials) # update() does not require all the parameters, only the updated ones
    return f"User with ID {user_id} has been successfully updated."

def delete_user(user_id):
    db.collection('Users').document(user_id).delete() # Delete by user_id
    return f"User with ID {user_id} has been successfully deleted."

# User Biometrics
def get_user_biometrics(user_id):
    biometrics_ref = db.collection('Biometrics').document(user_id)
    biometrics_doc = biometrics_ref.get()
    return biometrics_doc.to_dict()

def add_user_biometrics(user_id, biometrics):
    biometrics_ref = db.collection('Biometrics').document(user_id)
    biometrics_ref.set(biometrics)
    return f"Biometrics for user with ID {user_id} has been successfully added."

def edit_user_biometrics(user_id, updated_biometrics):
    biometrics_ref = db.collection('Biometrics').document(user_id)
    biometrics_ref.update(updated_biometrics)
    return f"Biometrics for user with ID {user_id} has been successfully updated"

def delete_user_biometrics(user_id):
    biometrics_ref = db.collection('Biometrics').document(user_id)
    biometrics_ref.delete()
    return f"Biometrics for user with ID {user_id} has been successfully deleted"

# User Chat Conversations
def get_user_chat(user_id):
    chat_ref = db.collection('Chats').document(user_id)
    chat_doc = chat_ref.get()
    return chat_doc.to_dict()

def add_user_chat(user_id, chat):
    chat_ref = db.collection('Chats').document(user_id)
    chat_ref.set(chat)
    return f"Chats for user with ID {user_id} has been successfully added."

def edit_user_chat(user_id, updated_chat):
    chat_ref = db.collection('Chats').document(user_id)
    chat_ref.update(updated_chat)
    return f"Chats for user with ID {user_id} has been successfully updated"

def delete_user_chat(user_id):
    chat_ref = db.collection('Chats').document(user_id)
    chat_ref.delete()
    return f"Chats for user with ID {user_id} has been successfully deleted"

