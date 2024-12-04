import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud.firestore import DELETE_FIELD

# Use a service account
cred = credentials.Certificate('key.json') # Assuming you stored your key file as 'key.json' under backend/
firebase_admin.initialize_app(cred)
db = firestore.client()

# User Biometrics
def get_user_biometrics(user_id):
    biometrics_ref = db.collection('Biometrics').document(user_id)
    biometrics_doc = biometrics_ref.get()
    return biometrics_doc.to_dict()

def set_user_biometrics(user_id, biometrics):
    biometrics_ref = db.collection('Biometrics').document(user_id)
    biometrics_ref.set(biometrics)
    return f"Biometrics for user with ID {user_id} has been successfully set."

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

# User Diagnoses
def get_user_diagnosis_list(user_id):
    diagnosis_ref = db.collection('Diagnoses').document(user_id)
    diagnosis_dict = diagnosis_ref.get().to_dict()
    diagnosis_list = [{"timestamp": k, **v} for k, v in diagnosis_dict.items()] # Extract dateTime and add it as a parameter; convert from a dict to a list
    return diagnosis_list


def add_user_diagnosis(user_id, new_diagnosis):
    diagnosis_ref = db.collection('Diagnoses').document(user_id)
    diagnosis_ref.set(new_diagnosis, merge=True)
    return f"New diagnosis for user with ID {user_id} has been successfully added"

def delete_user_diagnosis(user_id, date_time):
    diagnosis_ref = db.collection('Diagnoses').document(user_id)
    diagnosis_ref.update({
        date_time: DELETE_FIELD
    })
    return f"Diagnosis for user with ID {user_id} has been successfully deleted"

def delete_user_diagnosis_list(user_id):
    diagnosis_ref = db.collection('Diagnoses').document(user_id)
    diagnosis_ref.delete()
    return f"All diagnoses for user with ID {user_id} have been successfully deleted"
